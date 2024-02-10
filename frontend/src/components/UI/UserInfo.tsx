import { FC } from 'react';

import Avatar from './Avatar';
import { User } from '../../services/usersService';

type UserInfoProps = {
	user: User;
};

const UserInfo: FC<UserInfoProps> = ({ user }) => {
	return (
		<div className='flex gap-4 py-5'>
			{user && <Avatar user={user} size='xl' />}

			<div className='flex flex-col justify-center'>
				{user && (
					<>
						<p className='card-title text-lg'>
							{user.firstName} {user.lastName}
						</p>
						<p className='max-w-52 break-words text-xs'>
							{user.email.length > 25 ? (
								<>
									{user.email.substring(0, user.email.indexOf('@'))}
									<br />@{user.email.split('@')[1]}
								</>
							) : (
								user.email
							)}
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default UserInfo;
