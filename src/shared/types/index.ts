export type AttributeFile = {
  id: number;
  name: string;
  value: string;
};

export type TasksStatus = {
  isCompleted: boolean;
  inProgress: boolean;
};
export type Tasks = {
  parse: TasksStatus;
  frameExtract: TasksStatus;
};

export type VideoDuration = {
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: string;
};

export type RegisteredFile = {
  id: number;
  name: string;
  order: number;
  groupId: string;
  imagePath: string;
  videoPath: string;
  attributes: AttributeFile[];
  videoDuration: VideoDuration;
  tasks: Tasks;
};
