Kanboard API Reference for n8n IntegrationThis document provides a comprehensive overview of the Kanboard API endpoints, tailored for developers building custom integrations like an n8n node.1. Core ConceptsAuthenticationKanboard uses API Keys for authentication. You need to include your API key in the Authorization header with the Bearer scheme for every request.Header Example:Authorization: Bearer YOUR_API_KEYYou can find your API key in your Kanboard user profile under API.Rate LimitingThe API is rate-limited to 200 requests per minute. If you exceed this limit, you will receive a 429 Too Many Requests status code.Base URLAll API endpoints are prefixed with: https://kan.bn/api/v12. WebhooksWebhooks allow you to receive real-time notifications for events in Kanboard.Create a WebhookPOST /webhooksDescription: Creates a new webhook subscription.Body Parameters:url (string, required): The URL where the webhook payload will be sent.events (array of strings, required): A list of events to subscribe to. See Kanboard documentation for a full list of available events (e.g., task.create, task.update).
Example Request:{
  "url": "[https://your-n8n-webhook-url.com/webhook](https://your-n8n-webhook-url.com/webhook)",
  "events": ["task.create", "task.move", "comment.create"]
}
Example Response (201 Created):{
  "id": "wh_12345",
  "url": "[https://your-n8n-webhook-url.com/webhook](https://your-n8n-webhook-url.com/webhook)",
  "events": ["task.create", "task.move", "comment.create"],
  "created_at": "2023-10-27T10:00:00Z"
}
Get a WebhookGET /webhooks/{webhookId}Description: Retrieves the details of a specific webhook.Example Response (200 OK):{
  "id": "wh_12345",
  "url": "[https://your-n8n-webhook-url.com/webhook](https://your-n8n-webhook-url.com/webhook)",
  "events": ["task.create", "task.move", "comment.create"],
  "created_at": "2023-10-27T10:00:00Z"
}
List All WebhooksGET /webhooksDescription: Returns a list of all your webhooks.Example Response (200 OK):[
  {
    "id": "wh_12345",
    "url": "[https://your-n8n-webhook-url.com/webhook](https://your-n8n-webhook-url.com/webhook)",
    "events": ["task.create", "task.move"],
    "created_at": "2023-10-27T10:00:00Z"
  },
  {
    "id": "wh_67890",
    "url": "[https://another-webhook.com/handler](https://another-webhook.com/handler)",
    "events": ["comment.create"],
    "created_at": "2023-10-26T15:30:00Z"
  }
]
Delete a WebhookDELETE /webhooks/{webhookId}Description: Deletes a specific webhook subscription.Response: A 204 No Content status on success.3. ProjectsList All ProjectsGET /projectsDescription: Returns a list of all projects accessible to you.Example Response (200 OK):[
  {
    "id": "proj_1",
    "name": "Website Redesign",
    "identifier": "WEBSITE",
    "is_active": true,
    "created_at": "2023-01-15T09:00:00Z"
  },
  {
    "id": "proj_2",
    "name": "Q4 Marketing Campaign",
    "identifier": "MKTG",
    "is_active": true,
    "created_at": "2023-02-20T11:00:00Z"
  }
]
Get a ProjectGET /projects/{projectId}Description: Retrieves the details of a specific project.Example Response (200 OK):{
  "id": "proj_1",
  "name": "Website Redesign",
  "identifier": "WEBSITE",
  "is_active": true,
  "description": "A project to overhaul the company website.",
  "created_at": "2023-01-15T09:00:00Z"
}
4. BoardsList All BoardsGET /projects/{projectId}/boardsDescription: Returns a list of all boards within a specific project.Example Response (200 OK):[
  {
    "id": "board_1",
    "name": "Development Sprint",
    "project_id": "proj_1",
    "created_at": "2023-01-16T10:00:00Z"
  }
]
Get a BoardGET /boards/{boardId}Description: Retrieves the details of a specific board.Example Response (200 OK):{
  "id": "board_1",
  "name": "Development Sprint",
  "description": "Tasks for the current development cycle.",
  "project_id": "proj_1",
  "created_at": "2023-01-16T10:00:00Z"
}
5. ColumnsList All ColumnsGET /boards/{boardId}/columnsDescription: Returns a list of all columns on a specific board.Example Response (200 OK):[
  {
    "id": "col_1",
    "title": "To Do",
    "position": 1,
    "board_id": "board_1"
  },
  {
    "id": "col_2",
    "title": "In Progress",
    "position": 2,
    "board_id": "board_1"
  },
  {
    "id": "col_3",
    "title": "Done",
    "position": 3,
    "board_id": "board_1"
  }
]
Get a ColumnGET /columns/{columnId}Description: Retrieves the details of a specific column.Example Response (200 OK):{
  "id": "col_2",
  "title": "In Progress",
  "position": 2,
  "task_limit": 5,
  "board_id": "board_1"
}
6. TasksList All TasksGET /tasksDescription: Returns a list of all tasks. Can be filtered by project_id.Query Parameters:project_id (string, optional): Filter tasks by a specific project ID.Example Response (200 OK):[
  {
    "id": "task_123",
    "title": "Implement login page",
    "project_id": "proj_1",
    "column_id": "col_2",
    "owner_id": "user_abc",
    "due_date": "2023-11-15T23:59:59Z",
    "created_at": "2023-10-27T14:00:00Z"
  }
]
Get a TaskGET /tasks/{taskId}Description: Retrieves the details of a specific task.Example Response (200 OK):{
  "id": "task_123",
  "title": "Implement login page",
  "description": "Create the UI and backend logic for user authentication.",
  "project_id": "proj_1",
  "column_id": "col_2",
  "owner_id": "user_abc",
  "creator_id": "user_xyz",
  "date_due": "2023-11-15T23:59:59Z",
  "date_started": "2023-10-28T09:00:00Z",
  "position": 1,
  "url": "[https://kan.bn/task/123](https://kan.bn/task/123)",
  "created_at": "2023-10-27T14:00:00Z"
}
Create a TaskPOST /tasksDescription: Creates a new task.Body Parameters:title (string, required): The title of the task.project_id (string, required): The ID of the project this task belongs to.column_id (string, optional): The ID of the column to place the task in.owner_id (string, optional): The ID of the user assigned to the task.description (string, optional): A description for the task.due_date (string, optional): ISO 8601 formatted due date.Example Request:{
  "title": "Design new logo",
  "project_id": "proj_1",
  "owner_id": "user_abc",
  "description": "Create 3 logo mockups for review."
}
Example Response (201 Created):{
  "id": "task_124",
  "title": "Design new logo",
  "project_id": "proj_1",
  "column_id": "col_1",
  "owner_id": "user_abc",
  "created_at": "2023-10-27T15:00:00Z"
}
Update a TaskPUT /tasks/{taskId}Description: Updates an existing task.Body Parameters: Any of the parameters from the "Create a Task" endpoint can be provided.Example Request:{
  "column_id": "col_3",
  "due_date": "2023-11-20T23:59:59Z"
}
Example Response (200 OK):{
  "id": "task_124",
  "title": "Design new logo",
  "project_id": "proj_1",
  "column_id": "col_3",
  "owner_id": "user_abc",
  "due_date": "2023-11-20T23:59:59Z",
  "created_at": "2023-10-27T15:00:00Z"
}
Delete a TaskDELETE /tasks/{taskId}Description: Deletes a specific task.Response: A 204 No Content status on success.7. SubtasksList All Subtasks for a TaskGET /tasks/{taskId}/subtasksDescription: Returns a list of all subtasks for a given task.Example Response (200 OK):[
  {
    "id": "sub_1",
    "title": "Research logo ideas",
    "status": 0,
    "position": 1,
    "task_id": "task_124"
  }
]
Get a SubtaskGET /subtasks/{subtaskId}Description: Retrieves the details of a specific subtask.Create a SubtaskPOST /tasks/{taskId}/subtasksDescription: Creates a new subtask for a given task.Body Parameters:title (string, required): The title of the subtask.Example Request:{
  "title": "Sketch initial concepts"
}
Update a SubtaskPUT /subtasks/{subtaskId}Description: Updates an existing subtask.Body Parameters:title (string, optional): The new title.status (integer, optional): The status (0 for todo, 1 for in progress, 2 for done).Delete a SubtaskDELETE /subtasks/{subtaskId}Description: Deletes a specific subtask.Response: A 204 No Content status on success.8. UsersList All UsersGET /usersDescription: Returns a list of all users in the workspace.Example Response (200 OK):[
  {
    "id": "user_abc",
    "username": "alice",
    "name": "Alice Wonderland",
    "email": "alice@example.com"
  },
  {
    "id": "user_xyz",
    "username": "bob",
    "name": "Bob Builder",
    "email": "bob@example.com"
  }
]
Get a UserGET /users/{userId}Description: Retrieves the details of a specific user.9. CommentsList All Comments for a TaskGET /tasks/{taskId}/commentsDescription: Returns a list of all comments for a given task.Example Response (200 OK):[
  {
    "id": "comment_1",
    "task_id": "task_123",
    "user_id": "user_xyz",
    "comment": "Can we get this done by Friday?",
    "created_at": "2023-10-27T16:00:00Z"
  }
]
Create a CommentPOST /tasks/{taskId}/commentsDescription: Creates a new comment on a task.Body Parameters:content (string, required): The text of the comment.user_id (string, required): The ID of the user posting the comment.Example Request:{
  "content": "Great work on this!",
  "user_id": "user_abc"
}
Example Response (201 Created):{
  "id": "comment_2",
  "task_id": "task_123",
  "user_id": "user_abc",
  "comment": "Great work on this!",
  "created_at": "2023-10-27T17:00:00Z"
}
