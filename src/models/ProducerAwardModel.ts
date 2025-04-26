export interface ProducerAwardModel {
  id?: number;
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
  type?: string;
}
