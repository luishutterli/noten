# Important
- **The prefix `um_` on the `name` field needs to be present if the subject is user made (not premade)**
    - Due to the nature of this we might not need the `premade` field??

# DB Structure
Firebase Collection `subjects`
#### Universal
- `name`: Name, `(string)`
- `premade`: User made or premade, `(boolean)`
- `type`: Either `subject,group,halfterm`, `(string)`
- `weight`: Weight used for calculating average, `(number)`
#### Special
- `uid`: User ID of the owning user, `(string)` -> Used in type subject, group and halfterm if user made (not premade)
- `teacher`: Teacher Name, `(string)` -> Used in type subject
- `members`: Array of id's to sub-subjects(or groups), `(array of strings)` -> Used in type halfterm and group
- `groupings`: Grouping for advanced report card view, `(map (group:array), array of strings (ids to subjects))`
- `collectAs`: How a group should take its sub subjects grade into its average (`"halfRounded" or "notRounded"`), `(string)`

