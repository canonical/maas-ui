import { Button, Input, Label } from "@canonical/react-components";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

/**
 * Highlights a portion of given text that matches substring.
 * @param {String} text - Text to search for substring.
 * @param {String} match - Substring to highlight.
 * @returns {Object} JSX with emphasised text.
 */
const highlightMatch = (text, match) => {
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

const sanitiseFilter = (filterText) => filterText.replace(/ /g, "-");

const generateDropdownItems = ({ filter, selectedTags, tags, updateTags }) => {
  const dropdownItems = [];
  if (
    filter &&
    !tags.some((tag) => tag === filter) &&
    !selectedTags.includes(filter)
  ) {
    // Insert an extra item for creating a new tag if filter is present and it
    // is neither an existing tag nor already in the list of selected tags.
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
    .filter((tag) => !selectedTags.includes(tag) && tag.includes(filter))
    .map((tag) => (
      <li className="tag-selector__dropdown-item" key={tag}>
        <Button
          appearance="base"
          className="tag-selector__dropdown-button"
          data-test="existing-tag"
          onClick={() => {
            updateTags([...selectedTags, tag]);
          }}
          type="button"
        >
          {filter ? highlightMatch(tag, filter) : tag}
        </Button>
      </li>
    ));
  dropdownItems.push(existingTagItems);
  return dropdownItems;
};

const generateSelectedItems = ({ selectedTags, updateTags }) =>
  selectedTags.map((tag) => (
    <li className="tag-selector__selected-item" key={tag}>
      <Button
        appearance="base"
        className="tag-selector__selected-button"
        data-test="selected-tag"
        dense
        hasIcon
        onClick={() =>
          updateTags(
            selectedTags.filter((item) => item !== tag),
            false
          )
        }
      >
        <span>{tag}</span>
        <i className="p-icon--close" />
      </Button>
    </li>
  ));

export const TagSelector = ({
  initialSelected = [],
  label,
  onTagsUpdate,
  placeholder = "Tags",
  required,
  tags,
}) => {
  const wrapperRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(initialSelected);
  const [filter, setFilter] = useState("");

  const updateTags = (newSelectedTags, clearFilter = true) => {
    const sortedTags = newSelectedTags.sort((a, b) => a.localeCompare(b));
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

  return (
    <div className="tag-selector" ref={wrapperRef}>
      <Label onClick={() => setDropdownOpen(true)}>{label}</Label>
      {selectedTags.length > 0 && (
        <ul className="tag-selector__selected-list">
          {generateSelectedItems({ selectedTags, updateTags })}
        </ul>
      )}
      <Input
        className={classNames("tag-selector__input", {
          "tags-selected": selectedTags.length > 0,
        })}
        onChange={(e) => setFilter(e.target.value)}
        onFocus={() => setDropdownOpen(true)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            updateTags([...selectedTags, sanitiseFilter(filter)]);
          }
        }}
        placeholder={placeholder}
        required={required}
        type="text"
        value={filter}
      />
      {dropdownOpen && (
        <div className="tag-selector__dropdown">
          <ul className="tag-selector__dropdown-list">
            {generateDropdownItems({
              filter,
              selectedTags,
              tags,
              updateTags,
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
