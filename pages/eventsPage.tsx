import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import MainLayout from '../components/MainLayout';
import getAllEvents from '../scripts/event-generator-sheets.mjs';
import styles from '../styles/Events.module.scss';
import vars from '../styles/global_variables.module.scss';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  committee: string;
  event_type: string;
  registration_link: string;
  max_capacity: number;
  banner: string;
}

interface LocalTimeProps {
  start: string;
  end: string;
}

const LocalTimeDisplay: React.FC<LocalTimeProps> = ({ start, end }) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const formattedStartDate = startDate.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedEndTime = endDate.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <>
      {formattedStartDate} - {formattedEndTime}
    </>
  );
};

interface Props {
  events: Event[];
  committee: string;
}

export default function Events({ events }: Props): JSX.Element {
  // const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [indexedEvents] = useState<Event[]>( // wasn't using setindexedEvents so was getting linting errors </3
    events.map((event, index) => ({ ...event, id: index })),
  );
  //replace committee below
  const committee = vars.committee.toLowerCase();

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayUnixTime = Math.floor(now.getTime() / 1000);

  //filter by committee and if event is upcoming
  const filteredEvents = indexedEvents.filter((event) => {
    return (
      event.committee === committee &&
      parseInt(event.start) / 1000 >= todayUnixTime
    );
  });

  const uniqueEvents = Array.from(
    // filters out identical events, ignoring "id" field
    new Map(
      filteredEvents.map((event) => [
        JSON.stringify({ ...event, id: undefined }),
        event,
      ]),
    ).values(),
  );

  return (
    <MainLayout>
      <div className={styles.main}>
        <h1 className={styles.title}>Events</h1>
        <div>
          <h2 className={styles.subtitle}>Upcoming Events</h2>
          {/* if there are no events, display a message */}
          {uniqueEvents.length === 0 && (
            <div>
              <h4 className={styles.message}>Stay tuned for more events!</h4>
            </div>
          )}
          {filteredEvents.map((event, index) => {
            return (
              <div key={index} className={styles.card}>
                <EventCard
                  header={event.title}
                  body={event.description}
                  time={
                    <LocalTimeDisplay start={event.start} end={event.end} />
                  }
                  img={event.banner}
                />
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const events = await getAllEvents();
  // Attempt to replace new lines with <br/>, doesn't work
  // const processedEvents = events.map((event) => (
  //  {...event, description: <>{event.description.replace(/\n/g, '<br/>')}</>}));
  // console.log(processedEvents);
  for (const event of events) {
    event.banner = await event.banner;
  }

  return {
    props: {
      events: events,
    },
    revalidate: 3600,
  };
};
