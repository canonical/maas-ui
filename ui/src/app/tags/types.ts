import type { ValueOf } from "@canonical/react-components";

import type { TagHeaderViews } from "./constants";

import type { HeaderContent, SetHeaderContent } from "app/base/types";

export type TagHeaderContent = HeaderContent<ValueOf<typeof TagHeaderViews>>;

export type TagSetHeaderContent = SetHeaderContent<TagHeaderContent>;
