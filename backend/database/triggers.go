package database

import "log"

const DECREMENT_LIKES_COUNT_TRIGGER string = `CREATE TRIGGER IF NOT EXISTS decrement_likes_count
	AFTER DELETE ON USER_INTERACTIONS
	WHEN OLD.interaction_type = 'like'
	BEGIN
		UPDATE CONTENTS
		SET likes_count = MAX(0, likes_count - 1),
			updated_at = CURRENT_TIMESTAMP
		WHERE content_id = OLD.content_id;
	END;`

const INCREMENT_LIKES_COUNT_TRIGGER string = `CREATE TRIGGER IF NOT EXISTS increment_likes_count
	AFTER INSERT ON USER_INTERACTIONS
	WHEN NEW.interaction_type = 'like'
	BEGIN
		UPDATE CONTENTS
		SET likes_count = likes_count + 1,
			updated_at = CURRENT_TIMESTAMP
		WHERE content_id = NEW.content_id;
	END;`

const INCREMENT_DISLIKES_COUNT_TRIGGER string = `CREATE TRIGGER IF NOT EXISTS increment_dislikes_count
	AFTER INSERT ON USER_INTERACTIONS
	WHEN NEW.interaction_type = 'dislike'
	BEGIN
    	UPDATE CONTENTS
    	SET dislikes_count = dislikes_count + 1,
        	updated_at = CURRENT_TIMESTAMP
    	WHERE content_id = NEW.content_id;
	END;`

const DECREMENT_DISLIKES_COUNT_TRIGGER string = `
	CREATE TRIGGER IF NOT EXISTS decrement_dislikes_count
	AFTER DELETE ON USER_INTERACTIONS
	WHEN OLD.interaction_type = 'dislike'
	BEGIN
    	UPDATE CONTENTS
    	SET dislikes_count = MAX(0, dislikes_count - 1),
        	updated_at = CURRENT_TIMESTAMP
    	WHERE content_id = OLD.content_id;
	END;`

const HANDLE_INTERACTION_TRIGGER string = `CREATE TRIGGER IF NOT EXISTS handle_user_interaction
AFTER INSERT ON USER_INTERACTIONS
BEGIN
    -- Handle removing previous opposite interaction if exists
    DELETE FROM USER_INTERACTIONS 
    WHERE user_id = NEW.user_id 
    AND content_id = NEW.content_id 
    AND interaction_type != NEW.interaction_type 
    AND rowid != NEW.rowid;  -- Prevent deleting the new row itself

END;`

const INCREMENT_COMMENTS_COUNT_TRIGGER string = `
	CREATE TRIGGER IF NOT EXISTS increment_comments_count
	AFTER INSERT ON CONTENTS
	WHEN NEW.parent_id IS NOT NULL
	BEGIN
		-- Update only the immediate parent's comments count
		UPDATE CONTENTS
		SET comments_count = comments_count + 1,
			updated_at = CURRENT_TIMESTAMP
		WHERE content_id = NEW.parent_id;
	END;`

const DECREMENT_COMMENTS_COUNT_TRIGGER string = `
	CREATE TRIGGER IF NOT EXISTS decrement_comments_count
	AFTER DELETE ON CONTENTS
	WHEN OLD.parent_id IS NOT NULL
	BEGIN
		-- Update only the immediate parent's comments count
		UPDATE CONTENTS
		SET comments_count = MAX(0, comments_count - 1),
			updated_at = CURRENT_TIMESTAMP
		WHERE content_id = OLD.parent_id;
	END;`

var Triggers = []string{
	INCREMENT_LIKES_COUNT_TRIGGER,
	DECREMENT_LIKES_COUNT_TRIGGER,
	INCREMENT_DISLIKES_COUNT_TRIGGER,
	DECREMENT_DISLIKES_COUNT_TRIGGER,
	HANDLE_INTERACTION_TRIGGER,
	INCREMENT_COMMENTS_COUNT_TRIGGER,
}

func (m *UserModel) InitTriggers() {
	for _, trigger := range Triggers {
		if err := m.executeStatement(trigger); err != nil {
			log.Printf("Error creating forum trigger: %v%v", err, trigger)
		}
	}
}
