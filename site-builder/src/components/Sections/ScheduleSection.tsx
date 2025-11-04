import React from 'react';
import { ScheduleSectionProps } from '../../types';
import './ScheduleSection.css';

interface ScheduleSectionComponentProps {
  section: ScheduleSectionProps;
  isEditable?: boolean;
  onEdit?: (id: string) => void;
}

const ScheduleSection: React.FC<ScheduleSectionComponentProps> = ({
  section,
  isEditable = false,
  onEdit
}) => {
  const { data } = section;
  const layout = data.layout || 'timeline';

  return (
    <section
      className="schedule-section"
      onClick={() => isEditable && onEdit && onEdit(section.id)}
    >
      <div className="schedule-container">
        <div className="schedule-header">
          <h2 className="schedule-title">{data.title}</h2>
        </div>

        <div className={`schedule-${layout}`}>
          {data.events.map((event) => (
            <div key={event.id} className="schedule-item">
              <div className="schedule-time">{event.time}</div>
              <div className="schedule-details">
                <h3 className="schedule-event-title">{event.title}</h3>
                {event.speaker && (
                  <p className="schedule-speaker">Por: {event.speaker}</p>
                )}
                {event.description && (
                  <p className="schedule-description">{event.description}</p>
                )}
                {event.location && (
                  <p className="schedule-location">📍 {event.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
