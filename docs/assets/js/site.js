(function () {
	'use strict';

	/* eslint-env browser */
	/* eslint new-cap:0,no-undef:0,unicorn/prefer-query-selector:0 */
	/* global anchors */

	// add anchor links to headers
	anchors.options.placement = 'left';
	anchors.add('h3').remove('.no-anchor');

	// Filter UI
	const tocElements = document.querySelector('#toc').querySelectorAll('li');

	document.querySelector('#filter-input').addEventListener('keyup', event_ => {
		// Enter key
		if (event_.key === 'Enter') {
			// Go to the first displayed item in the toc
			for (const element of tocElements) {
				if (!element.classList.contains('display-none')) {
					location.replace(element.firstChild.href);
					return event_.preventDefault()
				}
			}
		}

		let match = () => true;

		const value = document.querySelector('#filter-input').value.toLowerCase();

		if (!/^\s*$/.test(value)) {
			match = element =>
				element.firstChild.innerHTML
				&& element.firstChild.innerHTML.toLowerCase().includes(value);
		}

		for (const element of tocElements) {
			const children = [...element.querySelectorAll('li')];
			if (match(element) || children.some(child => match(child))) {
				element.classList.remove('display-none');
			} else {
				element.classList.add('display-none');
			}
		}
	});

	const toggles = document.querySelectorAll('.toggle-sibling');

	for (const toggle of toggles) {
		toggle.addEventListener('click', toggleSibling);
	}

	function toggleSibling() {
		const stepSibling = this.parentNode.querySelectorAll('.toggle-target')[0];
		const icon = this.querySelectorAll('.icon')[0];
		const klass = 'display-none';
		if (stepSibling.classList.contains(klass)) {
			stepSibling.classList.remove(klass);
			icon.innerHTML = '▾';
		} else {
			stepSibling.classList.add(klass);
			icon.innerHTML = '▸';
		}
	}

	function showHashTarget(targetId) {
		const hashTarget = document.getElementById(targetId);
		// New target is hidden
		if (hashTarget && hashTarget.offsetHeight === 0
			&& hashTarget.parentNode.parentNode.classList.contains('display-none')) {
			hashTarget.parentNode.parentNode.classList.remove('display-none');
		}
	}

	window.addEventListener('hashchange', () => {
		showHashTarget(location.hash.slice(1));
	});

	showHashTarget(location.hash.slice(1));

	const toclinks = document.querySelectorAll('.pre-open');

	for (const toclink of toclinks) {
		toclink.addEventListener('mousedown', preOpen, false);
	}

	function preOpen() {
		showHashTarget(this.hash.slice(1));
	}

	const splitLeft = document.querySelector('#split-left');
	const splitRight = document.querySelector('#split-right');
	// TODO const splitParent = splitLeft.parentNode
	// TODO const cwWithSb = splitLeft.clientWidth
	splitLeft.style.overflow = 'hidden';
	// TODO const cwWithoutSb = splitLeft.clientWidth
	splitLeft.style.overflow = '';

	Split(['#split-left', '#split-right'], {
		elementStyle(dimension, size, gutterSize) {
			return {
				'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)',
			}
		},
		gutterStyle(dimension, gutterSize) {
			return {
				'flex-basis': gutterSize + 'px',
			}
		},
		gutterSize: 20,
		sizes: [20, 80],
	});

	// Chrome doesn't remember scroll position properly so do it ourselves.
	// Also works on Firefox and Edge.

	function updateState() {
		history.replaceState(
			{
				leftTop: splitLeft.scrollTop,
				rightTop: splitRight.scrollTop,
			},
			document.title,
		);
	}

	function loadState(ev) {
		if (ev) {
			// Edge doesn't replace change history.state on popstate.
			history.replaceState(ev.state, document.title);
		}

		if (history.state) {
			splitLeft.scrollTop = history.state.leftTop;
			splitRight.scrollTop = history.state.rightTop;
		}
	}

	window.addEventListener('load', () => {
		// Restore after Firefox scrolls to hash.
		setTimeout(() => {
			loadState();
			// Update with initial scroll position.
			updateState();
			// Update scroll positions only after we've loaded because Firefox
			// emits an initial scroll event with 0.
			splitLeft.addEventListener('scroll', updateState);
			splitRight.addEventListener('scroll', updateState);
		}, 1);
	});

	window.addEventListener('popstate', loadState);

})();
