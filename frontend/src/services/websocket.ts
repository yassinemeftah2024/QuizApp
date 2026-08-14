import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

/**
 * Service WebSocket centralisé.
 *
 * 1. connect()  → ouvre la connexion
 * 2. subscribe() → écoute un topic
 * 3. send()     → envoie un message au serveur
 * 4. disconnect() → ferme la connexion
 */
class WebSocketService {
  private client: Client | null = null
  private connected = false

  /**
   * Ouvre la connexion vers le backend.
   * URL : http://localhost:8080/api/ws  (SockJS gère le upgrade WS)
   */
  connect(onConnected?: () => void, onError?: (err: string) => void) {
    if (this.client?.active) return

    this.client = new Client({
      // SockJS a besoin d'une URL HTTP, pas ws://
      webSocketFactory: () => new SockJS('http://localhost:8080/api/ws'),

      // Reconnexion auto toutes les 3s si coupure
      reconnectDelay: 3000,

      // Logs utiles en dev
      debug: (msg) => console.log('[WS]', msg),

      onConnect: () => {
        this.connected = true
        console.log('[WS] Connecté ✔')
        onConnected?.()
      },

      onStompError: (frame) => {
        console.error('[WS] Erreur STOMP', frame.headers['message'])
        onError?.(frame.headers['message'] || 'Erreur WebSocket')
      },

      onWebSocketClose: () => {
        this.connected = false
        console.log('[WS] Déconnecté')
      },
    })

    this.client.activate()
  }

  /**
   * S'abonner à un topic.
   * Ex: /topic/session/4/participants
   */
  subscribe(destination: string, callback: (data: unknown) => void) {
    if (!this.client?.connected) {
      console.warn('[WS] Pas encore connecté, abonnement différé:', destination)
      // On réessaie après connexion
      const interval = setInterval(() => {
        if (this.client?.connected) {
          clearInterval(interval)
          this.client.subscribe(destination, (message: IMessage) => {
            const body = message.body ? JSON.parse(message.body) : null
            callback(body)
          })
        }
      }, 200)
      return
    }

    return this.client.subscribe(destination, (message: IMessage) => {
      const body = message.body ? JSON.parse(message.body) : null
      callback(body)
    })
  }

  /**
   * Envoyer un message au serveur.
   * Ex: destination = /app/session/4/next-question
   */
  send(destination: string, body: unknown = {}) {
    if (!this.client?.connected) {
      console.warn('[WS] Impossible d\'envoyer, non connecté')
      return
    }
    this.client.publish({
      destination,
      body: JSON.stringify(body),
    })
  }

  disconnect() {
    this.client?.deactivate()
    this.client = null
    this.connected = false
  }

  isConnected() {
    return this.connected
  }
}

// Instance unique (singleton)
export const wsService = new WebSocketService()