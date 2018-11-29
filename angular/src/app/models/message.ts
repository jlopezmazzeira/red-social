export class Message {
  constructor(
    public id: number,
    public receiver: number,
    public text: string,
    public image: string,
    public file: string,
    public readed: number
  ){}
}
