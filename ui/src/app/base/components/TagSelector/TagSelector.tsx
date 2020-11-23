import React, { useEffect, useRef, useState } from "react";

import { Button, Input } from "@canonical/react-components";
import Field from "@canonical/react-components/dist/components/Field";
import classNames from "classnames";

export type Tag = {
  id: number;
  name: string;
  displayName?: string;
  description?: string;
};

/**
 * Highlights a portion of given text that matches substring.
 * @param text - Text to search for substring.
 * @param match - Substring to highlight.
 * @returns JSX with emphasised text.
 */
const highlightMatch = (text: string, match: string): JSX.Element => {
  const textArray = text.split(match);
  return (
    <span>
      {textArray.map((item, i) => (
        <span key={`${item}${i}`}>
          {item}
          {i !== textArray.length - 1 && <em>{match}</em>}
        </span>
      ))}
    </span>
  );
};

const sanitiseFilter = (filterText: string) => ({
  name: filterText.replace(/ /g, "-"),
});

const generateDropdownItems = ({
  allowNewTags,
  filter,
  selectedTags,
  tags,
  updateTags,
}): JSX.Element[] => {
  const dropdownItems = [];
  if (
    allowNewTags &&
    filter &&
    !tags.some((tag) => (tag.displayName || tag.name) === filter) &&
    !selectedTags.some((tag) => (tag.displayName || tag.name) === filter)
  ) {
    // Insert an extra item for creating a new tag if allowed and filter is not
    // an already existing tag
    const newTagItem = (
      <li className="tag-selector__dropdown-item" key={filter}>
        <Button
          appearance="base"
          className="tag-selector__dropdown-button"
          data-test="new-tag"
          onClick={() => {
            updateTags([...selectedTags, sanitiseFilter(filter)]);
          }}
          type="button"
        >
          <em>Create tag "{filter}"</em>
        </Button>
      </li>
    );
    dropdownItems.push(newTagItem);
  }

  const existingTagItems = tags
    .filter(
      (tag) =>
        (tag.displayName || tag.name).includes(filter) &&
        !selectedTags.some((selectedTag) => selectedTag.name === tag.name)
    )
    .map((tag) => (
      <li className="tag-selector__dropdown-item" key={tag.name}>
        <Button
          appearance="base"
          className="tag-selector__dropdown-button"
          data-test="existing-tag"
          onClick={() => {
            updateTags([...selectedTags, tag]);
          }}
          type="button"
        >
          {filter
            ? highlightMatch(tag.displayName || tag.name, filter)
            : tag.displayName || tag.name}
          {tag.description && (
            <div className="tag-selector__dropdown-item-description">
              {tag.description}
            </div>
          )}
        </Button>
      </li>
    ));

  return dropdownItems.concat(existingTagItems);
};

const generateSelectedItems = (
  selectedTags: Tag[],
  updateTags,
  disabledTags: Tag[]
) =>
  selectedTags.map((tag) => {
    const isDisabled = disabledTags?.some(
      (disabledTag) => disabledTag.id === tag.id
    );

    return (
      <li className="tag-selector__selected-item" key={tag.name}>
        <Button
          appearance="base"
          className="tag-selector__selected-button"
          data-test="selected-tag"
          disabled={isDisabled}
          dense
          hasIcon
          onClick={() =>
            updateTags(
              selectedTags.filter((item) => item !== tag),
              false
            )
          }
          type="button"
        >
          <span>{tag.name}</span>
          {!isDisabled && <i className="p-icon--close" />}
        </Button>
      </li>
    );
  });

type Props = {
  allowNewTags?: boolean;
  disabled?: boolean;
  error?: string;
  help?: string;
  initialSelected?: Tag[];
  label?: string;
  onTagsUpdate?: (tags: Tag[]) => void;
  placeholder: string;
  required?: boolean;
  tags: Tag[];
  disabledTags?: Tag[];
};

export const TagSelector = ({
  allowNewTags = false,
  disabled,
  error,
  help,
  initialSelected = [],
  label,
  onTagsUpdate,
  placeholder = "Tags",
  required = false,
  tags = [],
  disabledTags = [],
}: Props): JSX.Element => {
  const wrapperRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(initialSelected);
  const [filter, setFilter] = useState("");

  const updateTags = (newSelectedTags, clearFilter = true) => {
    const sortedTags = newSelectedTags.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setSelectedTags(sortedTags);
    onTagsUpdate && onTagsUpdate(sortedTags);
    clearFilter && setFilter("");
  };

  const handleClickOutside = (e) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(e.target) &&
      !e.target.className.includes("tag-selector")
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const dropdownItems = generateDropdownItems({
    allowNewTags,
    filter,
    selectedTags,
    tags,
    updateTags,
  });

  return (
    <Field
      error={error}
      help={help}
      label={
        label ? (
          <span onClick={() => setDropdownOpen(true)} ref={wrapperRef}>
            {label}
          </span>
        ) : undefined
      }
    >
      <div className="tag-selector">
        {selectedTags.length > 0 && (
          <ul className="tag-selector__selected-list">
            {generateSelectedItems(selectedTags, updateTags, disabledTags)}
          </ul>
        )}
        <Input
          className={classNames("tag-selector__input", {
            "tags-selected": selectedTags.length > 0,
          })}
          disabled={disabled}
          onChange={(e) => setFilter(e.target.value)}
          onFocus={() => setDropdownOpen(true)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (allowNewTags) {
                updateTags([...selectedTags, sanitiseFilter(filter)]);
              }
            }
          }}
          placeholder={selectedTags.length !== tags.length ? placeholder : ""}
          required={required}
          type="text"
          value={filter}
        />
        {dropdownOpen && dropdownItems.length >= 1 && (
          <div className="tag-selector__dropdown">
            <ul className="tag-selector__dropdown-list">{dropdownItems}</ul>
          </div>
        )}
      </div>
    </Field>
  );
};

export default TagSelector;
