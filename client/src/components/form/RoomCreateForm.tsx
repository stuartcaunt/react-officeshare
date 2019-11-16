import React, { FunctionComponent } from 'react';
import useForm from 'react-hook-form';

export const RoomCreateForm: FunctionComponent<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {

  const { register, handleSubmit } = useForm()
  const userName = localStorage.getItem('userName');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="room-join-container-box__help">You are about to create a new room. Please enter a room name.</p>
        <div className="room-join-container-box__username">
          <input type="text" required name="roomName" autoFocus={true} placeholder="Enter room name" ref={register({ required: true })} />

        </div>
      </div>
      <p className="room-join-container-box__help">Before joining the room, please tell us your name.</p>
      <div className="room-join-container-box__username">
        <input type="text" required name="userName" defaultValue={userName} placeholder="Enter your name" ref={register({ required: true })} />
      </div>
      <button className="room-join-container-box__join" type="submit">Create and join room</button>
    </form>
  );
}