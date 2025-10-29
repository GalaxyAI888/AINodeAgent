export interface CloudApp {
  createdAt: Date;
  description: string;
  icon: string;
  modelscope_path: string;
  modelsize: string;
  name: string;
  objectId: string;
  path: string;
  tags: string[];
  updatedAt: Date;
}

export interface ModelFile {
  source: string,
  worker_id: number,
  model_scope_model_id: string,
  model_scope_file_path: string,
  local_dir: string,
  cleanup_on_delete: boolean
}