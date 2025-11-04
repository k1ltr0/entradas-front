import React from 'react';
import { PricingSectionProps } from '../../types';
import './PricingSection.css';

interface PricingSectionComponentProps {
  section: PricingSectionProps;
  isEditable?: boolean;
  onEdit?: (id: string) => void;
}

const PricingSection: React.FC<PricingSectionComponentProps> = ({
  section,
  isEditable = false,
  onEdit
}) => {
  const { data } = section;
  const columns = data.columns || 3;

  return (
    <section
      className="pricing-section"
      onClick={() => isEditable && onEdit && onEdit(section.id)}
    >
      <div className="pricing-container">
        <div className="pricing-header">
          <h2 className="pricing-title">{data.title}</h2>
          {data.description && <p className="pricing-description">{data.description}</p>}
        </div>

        <div className={`pricing-grid pricing-grid-${columns}`}>
          {data.tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`pricing-card ${!ticket.available ? 'sold-out' : ''}`}
            >
              <h3 className="ticket-name">{ticket.name}</h3>
              <div className="ticket-price">
                <span className="price-currency">{ticket.currency}</span>
                <span className="price-amount">{ticket.price}</span>
              </div>
              {ticket.description && (
                <p className="ticket-description">{ticket.description}</p>
              )}
              {ticket.features && ticket.features.length > 0 && (
                <ul className="ticket-features">
                  {ticket.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              )}
              <button
                className="ticket-button"
                disabled={!ticket.available}
              >
                {ticket.available ? 'Comprar' : 'Agotado'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
