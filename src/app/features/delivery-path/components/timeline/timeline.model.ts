export interface ITimeline {
    date: string;
    events: IEvent[]
  }
  
  export interface IEvent{
    time: string;
    event: string
  }
  