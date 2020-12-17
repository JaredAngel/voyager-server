# Voyager Server

## API Documentation

### `/voyages`

##### REQUEST: `GET /voyages`
##### RESPONSE:
<pre><code>
[
    {
        "id": 1,
        "title": "First Voyage",
        "created_ts": "2029-01-22T16:28:32.615Z"
    },
    {
        "id": 2,
        "title": "Second Voyage",
        "created_ts": "2029-01-22T16:28:32.615Z"
    },
    {
        "id": 3,
        "title": "Third Voyage",
        "created_ts": "2029-01-22T16:28:32.615Z"
    },
    {
        "id": 4,
        "title": "Fourth Voyage",
        "created_ts": "2029-01-22T16:28:32.615Z"
    }
]
</pre></code>

##### REQUEST: `GET /voyages/voyage_id`
##### RESPONSE:
<pre><code>
{
    "id": 2,
    "title": "Second Voyage",
    "created_ts": "2029-01-22T16:28:32.615Z"
}
</pre></code>

##### REQUEST: `POST /voyages`
##### RESPONSE:
<pre><code>
{
    "title": "Fifth Voyage",
    "created_ts": "2020-12-17T07:32:08.307Z"
}
</pre></code>

##### REQUEST: `DELETE /voyages/voyage_id`
##### RESPONSE:
<pre><code>
{} // Voyage is removed from database
</pre></code>

### `/activities`

##### REQUEST: `GET /activities`
##### RESPONSE:
<pre><code>
[
    {
        "id": 1,
        "title": "First post!",
        "label": "Dining",
        "content": "Lorem Ipsum dolor sit",
        "created_ts": "2029-01-22T16:28:32.615Z",
        "voyage_id": 1
    },
    {
        "id": 2,
        "title": "Second post!",
        "label": "Landmark",
        "content": "Lorem Ipsum dolor sit",
        "created_ts": "2029-01-22T16:28:32.615Z",
        "voyage_id": 1
    },
    {
        "id": 3,
        "title": "Third post!",
        "label": "Recreation",
        "content": "Lorem Ipsum dolor sit",
        "created_ts": "2029-01-22T16:28:32.615Z",
        "voyage_id": 2
    }
]
</pre></code>

##### REQUEST: `GET /activities/activity_id`
##### RESPONSE:
<pre><code>
{
    "id": 5,
    "title": "Fifth post!",
    "label": "Educational",
    "content": "Lorem Ipsum dolor sit",
    "created_ts": "2029-01-22T16:28:32.615Z",
    "voyage_id": 3
}
</pre></code>

##### REQUEST: `POST /activities`
##### RESPONSE:
<pre><code>
{
        "title": "First post!",
        "label": "Dining",
        "content": "Lorem Ipsum dolor sit",
        "created_ts": "2029-01-22T16:28:32.615Z",
        "voyage_id": 1
}
</pre></code>

##### REQUEST: `DELETE /activities/activity_id`
##### RESPONSE:
<pre><code>
{} // Activity is removed from database
</pre></code>