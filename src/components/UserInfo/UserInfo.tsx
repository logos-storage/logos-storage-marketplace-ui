import { ChangeEvent, useState, KeyboardEvent } from "react";
import "./UserInfo.css";
import { Input } from "@codex-storage/marketplace-ui-components";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import { WebStorage } from "../../utils/web-storage";

type Props = {
  onNameChange?: (value: string) => void;
  onEnterPressed?: () => void;
};

export function UserInfo({ onNameChange, onEnterPressed }: Props) {
  const [displayName, setDisplayName] = useState(
    WebStorage.onBoarding.getDisplayName()
  );
  const [emoji, setEmoji] = useState(WebStorage.onBoarding.getEmoji());
  const [areEmojiVisible, setAreEmojiVisible] = useState(false);

  const onDisplayNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    WebStorage.onBoarding.setDisplayName(value);
    setDisplayName(value);
    onNameChange?.(value);
  };

  const onDisplayEmoji = () => setAreEmojiVisible(!areEmojiVisible);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setEmoji(emojiData.emoji);
    WebStorage.onBoarding.setEmoji(emojiData.emoji);
    setAreEmojiVisible(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnterPressed?.();
    }
  };

  return (
    <div className="user-info">
      <div className="emoji">
        {areEmojiVisible && (
          <EmojiPicker
            width={"auto"}
            emojiStyle={EmojiStyle.NATIVE}
            theme={Theme.DARK}
            lazyLoadEmojis={true}
            onEmojiClick={onEmojiClick}
            categories={
              [
                "smileys_people",
                "animals_nature",
                "food_drink",
                "travel_places",
                "activities",
                "objects",
                "symbols",
                "flags",
                // The type does not allow a string array but the api yes
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ] as any
            }
          />
        )}
        <div>
          <Input
            onChange={onDisplayNameChange}
            onClick={onDisplayEmoji}
            label="Account Emoji"
            readOnly={true}
            id="emoji"
            value={emoji}></Input>
        </div>
      </div>

      <div>
        <Input
          onChange={onDisplayNameChange}
          label="Preferred name"
          id="displayName"
          autoComplete="off"
          onKeyDown={onKeyDown}
          value={displayName}></Input>
      </div>
    </div>
  );
}
