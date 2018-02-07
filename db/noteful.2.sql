--`psql -U dev -f ./db/noteful.2.sql -d noteful-app`
SELECT CURRENT_DATE;

DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;

CREATE TABLE notes (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text,
  created timestamp DEFAULT now()
);

ALTER SEQUENCE notes_id_seq RESTART WITH 1000;


CREATE TABLE folders (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

ALTER SEQUENCE folders_id_seq RESTART WITH 100;

ALTER TABLE notes ADD COLUMN folder_id int REFERENCES folders ON DELETE SET NULL;

INSERT INTO folders (name) VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');

  INSERT INTO notes (title, content, folder_id) VALUES
  (
  '5 life lessons learned from cats',
  'Lorem ipsum i like cats',
  100
  ),
  (
  'What the government doesn''t want you to know about cats',
  'Posuere sollicitudin aliquam ultrices sagittis orci a.',
  100
  );

  INSERT INTO notes (title, content) VALUES 
  (
    'The most boring article about cats you''ll ever read',
    'Lorem ipsum dolor sit amet laborum.'
  ),
  (
    '7 things lady gaga has in common with cats',
    'Posuere sollicitudin aliquam'
  ),
  (
    'The most incredible article about cats you''ll ever read',
    'Lorem ipsum dolor sit'
  ),
  (
    '10 ways cats can help you live to 100',
    'Posuere sollicitudin aliquam ultrices'
  ),
  (
    '9 reasons you can blame the recession on cats',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit,'
  ),
  (
    '10 ways marketers are making you addicted to cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci a'
  ),
  (
    '11 ways investing in cats can make you a millionaire',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod '
  ),
  (
    'Why you should forget everything you learned about cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis'
  );
