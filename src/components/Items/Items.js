import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItemsStart } from '../../redux/Items/items.actions';
//components
import ItemCard from '../ItemCard/ItemCard';
import SearchInput from '../Search/Search';
import LoadMore from '../LoadMore/LoadMore';
import './items.scss';

const mapState = ({ items }) => ({
	itemsData: items.items,
});

const Items = (props) => {
	const history = useHistory();
	const { filterType } = useParams();
	const dispatch = useDispatch();
	const { itemsData } = useSelector(mapState);
	const [oups, setOups] = useState(false);
	const { data, queryDoc, isLastPage } = itemsData;

	useEffect(() => {
		dispatch(fetchItemsStart({ filterType }));
	}, [filterType]);

	// console.log(filterType);
	const handleFilters = async (e) => {
		e.preventDefault();
		const nextFilter = e.target.value.toLowerCase().split(' ');
		history.push(`/search/${nextFilter}`);
	};

	if (!Array.isArray(data)) return null;

	if (data.length < 1) {
		setTimeout(() => {
			setOups(true);
		}, 3000);
		return (
			<div>
				<div className="itemsWrapper">
					<div className="itemsIntro">
						<h1>Retrouvez toutes la boucle ici !</h1>
					</div>
					<SearchInput
						placeholder="le mot clef !"
						handleChange={handleFilters}
						defaultValue={filterType}
					/>
					<p>{!oups ? 'Loading...' : 'Oups... Aucun Loop à voir...'}</p>
				</div>
			</div>
		);
	}

	const handleLoadMore = () => {
		dispatch(
			fetchItemsStart({
				filterType,
				startAfterDoc: queryDoc,
				persistItems: data,
				isLastPage,
			}),
		);
	};

	const configLoadMore = {
		onLoadMoreEvt: handleLoadMore,
	};

	return (
		<div style={{ paddingBottom: 10 }}>
			<div className="itemsWrapper">
				<div className="itemsIntro">
					<h1>Retrouvez toutes la boucle ici !</h1>
				</div>
				<SearchInput handleChange={handleFilters} defaultValue={filterType} />

				{data.map((item, pos) => (
					<>{item.verified && <ItemCard item={item} index={pos} />}</>
				))}
			</div>
			{!isLastPage && <LoadMore {...configLoadMore} />}
		</div>
	);
};

export default Items;