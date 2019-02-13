import {Peer} from './Peer.model';

export class Room {
    private _peers: Map<string, Peer> = new Map<string, Peer>();

    constructor(private _socket: SocketIOClient.Socket, peerDataArrays: Array<any>, private _roomName: string, private _userName: string) {
        peerDataArrays.forEach(peerData => {
           const peer = new Peer(peerData.id, peerData.userdata);

           this._peers.set(peerData.id, peer);
        });

    }
}
