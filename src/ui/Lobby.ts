import { ChessGame } from '../game/ChessGame';
import { NetworkManager } from '../network/NetworkManager';

export class Lobby {
  private lobbyScreen: HTMLElement | null;
  private waitingSection: HTMLElement | null;
  private gameUI: HTMLElement | null;
  private shareLinkInput: HTMLInputElement | null;
  private connectionStatus: HTMLElement | null;

  constructor(private game: ChessGame, private networkManager: NetworkManager) {
    this.lobbyScreen = document.getElementById('lobby-screen');
    this.waitingSection = document.getElementById('waiting-section');
    this.gameUI = document.getElementById('game-ui');
    this.shareLinkInput = document.getElementById('share-link-input') as HTMLInputElement | null;
    this.connectionStatus = document.getElementById('connection-status');

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Create game button
    document.getElementById('btn-create-game')?.addEventListener('click', async () => {
      try {
        this.setConnectionStatus('Criando jogo...');
        const gameId = await this.networkManager.createGame();

        // Show waiting section
        if (this.waitingSection) {
          this.waitingSection.classList.remove('hidden');
        }

        // Set share link
        const shareLink = this.buildShareLink(gameId);
        if (this.shareLinkInput) {
          this.shareLinkInput.value = shareLink;
        }

        this.setConnectionStatus('Aguardando oponente...');
      } catch (error) {
        console.error('Failed to create game:', error);
        this.setConnectionStatus('Erro ao criar jogo. Tente novamente.');
      }
    });

    // Join game button
    document.getElementById('btn-join-game')?.addEventListener('click', async () => {
      const input = document.getElementById('input-game-id') as HTMLInputElement | null;
      const gameId = input?.value?.trim();

      if (!gameId) {
        this.setConnectionStatus('Digite o código do jogo.');
        return;
      }

      try {
        this.setConnectionStatus('Entrando no jogo...');
        await this.networkManager.joinGame(gameId);
        this.startGame();
      } catch (error) {
        console.error('Failed to join game:', error);
        this.setConnectionStatus('Erro ao entrar no jogo. Verifique o código.');
      }
    });

    // Copy link button
    document.getElementById('btn-copy-link')?.addEventListener('click', () => {
      if (this.shareLinkInput) {
        this.shareLinkInput.select();
        navigator.clipboard.writeText(this.shareLinkInput.value).then(() => {
          const btn = document.getElementById('btn-copy-link');
          if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Copiado!';
            setTimeout(() => {
              btn.textContent = originalText;
            }, 2000);
          }
        }).catch(() => {
          // Fallback for older browsers
          document.execCommand('copy');
        });
      }
    });

    // When opponent joins, start the game automatically
    this.networkManager.onPlayerJoined = () => {
      this.setConnectionStatus('Oponente conectado!');
      setTimeout(() => this.startGame(), 500);
    };

    // Check URL for game ID on load (joining via shared link)
    this.checkUrlForGameId();
  }

  private buildShareLink(gameId: string): string {
    return window.location.origin + window.location.pathname + '#/game/' + gameId;
  }

  private checkUrlForGameId(): void {
    const hash = window.location.hash;
    const match = hash.match(/#\/game\/(.+)/);
    if (match) {
      const gameId = match[1];
      const input = document.getElementById('input-game-id') as HTMLInputElement | null;
      if (input) {
        input.value = gameId;
      }
    }
  }

  private startGame(): void {
    this.lobbyScreen?.classList.add('hidden');
    if (this.waitingSection) {
      this.waitingSection.classList.add('hidden');
    }
    this.gameUI?.classList.remove('hidden');
    this.game.startGame(this.networkManager.playerColor);
  }

  private setConnectionStatus(message: string): void {
    if (this.connectionStatus) {
      this.connectionStatus.textContent = message;
    }
  }
}
