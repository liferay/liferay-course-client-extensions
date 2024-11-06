import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

// API helper function
const api = async (url, options = {}) => {
	return fetch(window.location.origin + '/' + url, {
		headers: {
			'Content-Type': 'application/json',
			'x-csrf-token': Liferay.authToken,
		},
		...options,
	});
};

// Function to get current user ID
const getCurrentUserId = async () => {
	const response = await api('o/headless-admin-user/v1.0/my-user-account');
	const data = await response.json();
	return data.id;
};

// Ticket component
function Ticket({ ticket, onToggle, isOpen }) {
	return React.createElement(
		'div',
		{ className: 'ticket-card', onClick: () => onToggle(ticket.id) },
		React.createElement(
			'div',
			{ className: 'ticket-header' },
			React.createElement('h3', { className: 'ticket-subject' }, ticket.subject),
			React.createElement(
				'span',
				{
					className: `ticket-status ${ticket.priority.key}`
				},
				ticket.ticketStatus.name // Show status name, no color overrides in JS
			)
		),
		isOpen &&
		React.createElement(
			'div',
			{ className: 'ticket-details' },
			React.createElement('p', null, `Description: ${ticket.description}`),
			ticket.attachment &&
			React.createElement(
				'a',
				{
					href: ticket.attachment.link.href,
					target: '_blank',
					rel: 'noopener noreferrer',
					className: 'ticket-attachment'
				},
				'View Attachment'
			),
			ticket.relatedTickets && ticket.relatedTickets.length > 0 && (
				React.createElement(
					'div',
					{ className: 'related-tickets' },
					React.createElement('h4', null, 'Related Tickets'),
					ticket.relatedTickets.map((related) =>
						React.createElement(
							'div',
							{ className: 'related-ticket-item', key: related.id },
							`ID: ${related.id} - ${related.subject}`
						)
					)
				)
			)
		)
	);
}

// Main component to display tabs and tickets list
function TicketsList() {
	const [tickets, setTickets] = useState([]);
	const [expandedTicket, setExpandedTicket] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState("open");

	useEffect(() => {
		getCurrentUserId().then((userId) => {
			api(`o/c/j3y7tickets`)
				.then((response) => response.json())
				.then((data) => {
					const userTickets = (data.items || []).filter(
						(ticket) => ticket.creator?.id === userId
					);
					setTickets(userTickets || []);
				})
				.catch((error) => console.error("Error fetching tickets:", error));
		});
	}, []);

	const toggleTicket = (ticketId) => {
		setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
	};

	const filteredTickets = tickets.filter((ticket) => ticket.ticketStatus.key === selectedStatus);

	return React.createElement(
		'div',
		{ className: 'tickets-container' },
		React.createElement(
			'div',
			{ className: 'tabs' },
			["open", "inProgress"].map((status) =>
				React.createElement(
					'button',
					{
						key: status,
						className: `tab-button ${selectedStatus === status ? 'active' : ''}`,
						onClick: () => setSelectedStatus(status)
					},
					status.charAt(0).toUpperCase() + status.slice(1)
				)
			)
		),
		React.createElement(
			'div',
			{ className: 'tickets-list' },
			filteredTickets.map((ticket) =>
				React.createElement(Ticket, {
					key: ticket.id,
					ticket,
					onToggle: toggleTicket,
					isOpen: expandedTicket === ticket.id,
				})
			)
		)
	);
}

// Custom Element class
class CustomElement extends HTMLElement {
	connectedCallback() {
		ReactDOM.render(React.createElement(TicketsList), this);
	}

	disconnectedCallback() {
		ReactDOM.unmountComponentAtNode(this);
	}
}

const ELEMENT_NAME = 'j3y7-tickets';

if (!customElements.get(ELEMENT_NAME)) {
	customElements.define(ELEMENT_NAME, CustomElement);
}
