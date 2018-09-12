/*
 * LiskHQ/lisk-explorer
 * Copyright © 2018 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
import angular from 'angular';
import AppTools from '../../app/app-tools.module';
import template from './transactions-filter.html';

const TransactionsConstructor = function ($rootScope, $scope, allTxs) {
	$scope.searchModel = [];
	$scope.searchParams = [];
	$scope.availableSearchParams = [
		{ key: 'senderId', name: 'Sender', placeholder: 'Sender...' },
		{ key: 'recipientId', name: 'Recipient', placeholder: 'Recipient...' },
		{ key: 'minAmount', name: 'Min', placeholder: 'Min Amount...' },
		{ key: 'maxAmount', name: 'Max', placeholder: 'Max Amount...' },
		{ key: 'type', name: 'Type', placeholder: 'Comma separated...' },
		{ key: 'senderPublicKey', name: 'SenderPk', placeholder: 'Sender Public Key...' },
		{ key: 'recipientPublicKey', name: 'RecipientPk', placeholder: 'Recipient Public Key...' },
		{ key: 'height', name: 'Block Height', placeholder: 'Block Id...' },
		{ key: 'blockId', name: 'Block Id', placeholder: 'Block Id...' },
		{ key: 'fromTimestamp', name: 'fromTimestamp', placeholder: 'From Timestamp...' },
		{ key: 'toTimestamp', name: 'toTimestamp', placeholder: 'To Timestamp...' },
		{ key: 'limit', name: 'limit', placeholder: 'Limit...' },
		{ key: 'offset', name: 'offset', placeholder: 'Offset...' },
		{
			key: 'sort',
			name: 'orderBy',
			placeholder: 'Order By...',
			restrictToSuggestedValues: true,
			suggestedValues: ['amount:asc', 'amount:desc', 'fee:asc', 'fee:desc', 'type:asc', 'type:desc', 'timestamp:asc', 'timestamp:desc'],
		},
	];

	$scope.parametersDisplayLimit = $scope.availableSearchParams.length;

	$scope.setTxs = (txs) => {
		$scope.txs = txs;
	};

	$scope.onFiltersUsed = () => {
		$scope.cleanByFilters = true;
		const { removeAll } = angular.element(document.getElementsByClassName('search-parameter-input')[0]).scope();
		if (removeAll) {
			removeAll();
		}
	};

	const onSearchBoxCleaned = () => {
		if ($scope.cleanByFilters) {
			$scope.cleanByFilters = false;
		} else {
			$scope.invalidParams = false;
			$scope.txs = allTxs();
			$scope.txs.loadData();
		}
	};

	const searchByParams = (params) => {
		if ($scope.direction !== 'search') {
			$scope.lastDirection = $scope.direction;
			$scope.direction = 'search';
		}
		$scope.invalidParams = false;
		$scope.txs = allTxs(params);
		$scope.txs.loadData();
	};

	const onSearchChange = () => {
		const params = {};
		Object.keys($scope.searchModel).forEach((key) => {
			if ($scope.searchModel[key] !== undefined && $scope.searchModel[key] !== '') {
				params[key] = $scope.searchModel[key];
			}
			if ((key === 'minAmount' || key === 'maxAmount') && params[key] !== '') {
				params[key] = Math.floor(parseFloat(params[key]) * 1e8);
			}
		});

		if (params.query) {
			params.senderId = params.query;
			params.recipientId = params.query;
		}

		if (Object.keys(params).length > 0) {
			searchByParams(params);
		} else if (Object.keys($scope.searchModel).length === 0) {
			onSearchBoxCleaned();
		} else {
			$scope.invalidParams = true;
		}
	};

	$rootScope.$on('advanced-searchbox:modelUpdated', (event, model) => {
		if ($scope.searchModel.query !== model.query) {
			$scope.searchModel = Object.assign({}, model);
			return onSearchChange();
		}

		return $scope.searchModel = Object.assign({}, model);
	});

	$rootScope.$on('advanced-searchbox:removedSearchParam', (event, searchParameter) => {
		delete $scope.searchModel[searchParameter.key];
		onSearchChange();
	});

	$rootScope.$on('advanced-searchbox:removedAllSearchParam', () => {
		onSearchBoxCleaned();
	});

	$rootScope.$on('advanced-searchbox:leavedEditMode', () => {
		onSearchChange();
	});
};

const transactionsFilter = AppTools.directive('transactionsFilter', () => ({
	template,
	controller: TransactionsConstructor,
	scope: {
		txs: '=',
		address: '=',
	},
}));

export default transactionsFilter;
