// ═══════════════════════════════════════════════════════════════════════
// QuizApp — Types TypeScript centralisés
// Reflète le modèle JPA Backend (Spring Boot)
// ═══════════════════════════════════════════════════════════════════════

// ─── Enums ─────────────────────────────────────────────────────────────

export type RoleEnum = 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT' | 'INVITE';

export type ModeQuizEnum = 'LIVE' | 'ENTRAINEMENT' | 'EXAMEN' | 'DEFI';

export type StatutSessionEnum =
  | 'EN_ATTENTE'
  | 'EN_COURS'
  | 'EN_PAUSE'
  | 'TERMINEE'
  | 'ANNULEE';

export type TypeQuestionEnum = 'QCM' | 'VRAI_FAUX' | 'TEXTE_LIBRE';

export type SourceGenerationEnum = 'MANUEL' | 'IA' | 'IMPORT';

export type AvatarAnimal =
  | 'Lion'
  | 'Tiger'
  | 'Eagle'
  | 'Dolphin'
  | 'Fox'
  | 'Panda'
  | 'Dragon'
  | 'Unicorn';

// ─── Auth ──────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: RoleEnum;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  utilisateur: UtilisateurDTO;
}

// ─── Utilisateur ───────────────────────────────────────────────────────

export interface UtilisateurDTO {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: RoleEnum;
  avatarAnimal?: AvatarAnimal;
  actif: boolean;
  dateCreation: string;
}

export interface EtudiantDTO extends UtilisateurDTO {
  niveau?: string;
  classeId?: number;
  totalPoints: number;
  totalQuizComplete: number;
}

export interface EnseignantDTO extends UtilisateurDTO {
  matiere?: string;
  etablissement?: string;
}

// ─── Invite (Guest) ────────────────────────────────────────────────────

export interface InviteDTO {
  id: number;
  pseudoNom: string;
  emailOptionnel?: string;
  avatarAnimal?: AvatarAnimal;
  sessionId: number;
  dateJoin: string;
}

export interface JoinAsGuestRequest {
  pseudoNom: string;
  emailOptionnel?: string;
  avatarAnimal: AvatarAnimal;
  pinCode: string;
}

// ─── Classe ────────────────────────────────────────────────────────────

export interface ClasseDTO {
  id: number;
  nom: string;
  niveau?: string;
  anneeAcademique?: string;
  nombreEtudiants?: number;
}

// ─── QCM ───────────────────────────────────────────────────────────────

export interface QCMDTO {
  id: number;
  titre: string;
  description?: string;
  matiere?: string;
  niveau?: string;
  mode: ModeQuizEnum;
  source: SourceGenerationEnum;
  dureeMinutes?: number;
  publie: boolean;
  archive: boolean;
  shuffleQuestions: boolean;
  showExplanations: boolean;
  allowRetakes: boolean;
  enseignantId: number;
  nombreQuestions: number;
  dateCreation: string;
  dateModification?: string;
}

export interface CreateQCMRequest {
  titre: string;
  description?: string;
  matiere?: string;
  niveau?: string;
  mode: ModeQuizEnum;
  dureeMinutes?: number;
  shuffleQuestions?: boolean;
  showExplanations?: boolean;
  allowRetakes?: boolean;
}

// ─── Question ──────────────────────────────────────────────────────────

export interface QuestionDTO {
  id: number;
  texte: string;
  type: TypeQuestionEnum;
  ordre: number;
  dureeSecondes: number;
  points: number;
  explication?: string;
  reponses: ReponseDTO[];
}

export interface CreateQuestionRequest {
  texte: string;
  type: TypeQuestionEnum;
  ordre?: number;
  dureeSecondes?: number;
  points?: number;
  explication?: string;
  reponses: CreateReponseRequest[];
}

// ─── Reponse ───────────────────────────────────────────────────────────

export interface ReponseDTO {
  id: number;
  texte: string;
  correcte: boolean;
  option: 'A' | 'B' | 'C' | 'D';
}

export interface CreateReponseRequest {
  texte: string;
  correcte: boolean;
  option: 'A' | 'B' | 'C' | 'D';
}

// ─── SessionQuiz ───────────────────────────────────────────────────────

export interface SessionQuizDTO {
  id: number;
  pinCode: string;
  statut: StatutSessionEnum;
  qcmId: number;
  qcmTitre: string;
  enseignantId: number;
  questionCourante: number;
  nombreParticipants: number;
  dateCreation: string;
  dateDemarrage?: string;
  dateFin?: string;
}

// ─── Participation ─────────────────────────────────────────────────────

export interface ParticipationDTO {
  id: number;
  etudiantId: number;
  etudiantNom: string;
  etudiantPrenom: string;
  avatarAnimal?: AvatarAnimal;
  sessionId: number;
  score: number;
  bonnesReponses: number;
  mauvaisesReponses: number;
  precision?: number;
  rang?: number;
  dureeSecondes?: number;
  dateParticipation: string;
}

// ─── Badge ─────────────────────────────────────────────────────────────

export interface BadgeDTO {
  id: number;
  nom: string;
  description?: string;
  icone?: string;
  couleur?: string;
  conditionObtention?: string;
}

// ─── API Response wrappers ─────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
  timestamp: string;
}

// ─── Live Session (WebSocket — dev-b) ─────────────────────────────────

/** Message WebSocket envoyé par le client */
export interface WsClientMessage {
  type: 'JOIN' | 'ANSWER' | 'LEAVE';
  sessionId: number;
  payload?: unknown;
}

/** Message WebSocket reçu du serveur */
export interface WsServerMessage {
  type:
    | 'QUESTION'
    | 'RESULTS'
    | 'LEADERBOARD'
    | 'SESSION_END'
    | 'PARTICIPANT_UPDATE';
  payload: unknown;
}
