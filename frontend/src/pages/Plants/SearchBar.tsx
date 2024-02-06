import { FC, useState } from 'react';

type SearchBarProps = {
	onSearch: (searchQuery: string) => void;
};

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
	const [searchTerm, setSearchTerm] = useState('');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchQuery = event.target.value;
		event.preventDefault();
		setSearchTerm(searchQuery);
    onSearch(searchQuery);
	};

	return (
		<div className='my-2'>
			<input
				type='text'
				placeholder='Search'
				value={searchTerm}
				onChange={handleChange}
				className='input input-bordered input-warning w-full'
			/>
		</div>
	);
};

export default SearchBar;
