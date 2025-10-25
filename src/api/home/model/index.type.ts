export interface CloudApp {
  id: string;
  name: string;
  desc: string;
  dockerImage: string;
  dockerfileUrl: string;
  stars: number;
  downloads: number;
  category: string;
}