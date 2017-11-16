# Using Max

As the official bot of the Full Sail Armada, Max offers simple but powerful automated user management tools that empower Armada members to verify membership eligibility and set roles for themselves within the server, freeing up admins, moderators, and officers for more important tasks.

## Commands

Each of the commands that Max offers can be invoked from inside a text channel by using an exclamation point followed by the command keyword (like `!command`). Individual commands are not case-sensitive, but some of the information needed for each command may be.

### !help

Example: `!help`

Displays all of Max's available commands.

### !verify

Example: `!verify <email_address>`

Verifies that the user has a valid Full Sail University email address and adds the user to the Discord server. This command also adds the user's username and FS email address to the Armada database so Armada officers can match users to real-life students.

### !roles

Example: `!roles`

Sends a DM to the user with a list of all available Armada roles.

### !addRole

Example: `!addRole <role_name>`

Adds the specified role to the user. Role names _are_ case-sensitive. Note that not all roles can be added this way—no promoting yourself to Fleet Officer, for example.

### !addRoles

Example: `!addRoles <role_name>,<role_name>,<role_name>`

Adds multiple specified roles to the user all at once. The same caveat as above applies.

### !removeRole

Example: `!removeRole <role_name>`

Removes a single specified role from the user.

### !addAllRoles

Example: `!addAllRoles`

Adds all available Armada roles to the user. Suitable for masochists and chat room junkies.

### !removeAllRoles

Example: `!removeAllRoles`

Removes all roles from the user. _Tabula rasa_, baby.


## Administrative commands

Max also includes a couple of special commands just for Officers and above for making announcements to multiple channels.
