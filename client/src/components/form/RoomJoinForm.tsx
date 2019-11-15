import React, { FunctionComponent } from 'react';
import useForm from 'react-hook-form';

export const RoomJoinForm: FunctionComponent<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {

  const { register, handleSubmit } = useForm()
  const username = localStorage.getItem('username');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="room-join-container-box__help">Before joining the room, please tell us your name.</p>
      <div className="room-join-container-box__username">
        <input type="text" required name="userName" defaultValue={username} autoFocus={true} placeholder="Enter your name" ref={register({ required: true })} />
      </div>
      <button className="room-join-container-box__join" type="submit">Join room</button>
    </form>
  );
}