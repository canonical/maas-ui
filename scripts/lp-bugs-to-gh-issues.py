#!/usr/bin/python3

from launchpadlib.launchpad import Launchpad
from github import Github

github = Github(os.getenv("GITHUB_TOKEN"))
github_repo = github.get_repo("canonical-web-and-design/maas-ui")
launchpad = Launchpad.login_with("Canonical web team stats", "production")
project = launchpad.projects["maas"]
ui_project = launchpad.projects["maas-ui"]


def generate_open_bugs():
    for task in project.searchTasks(status=["New"], tags=["ui"]):
        has_ui_task = any(t.target == ui_project for t in task.related_tasks)
        if not has_ui_task:
            yield task.bug


def create_bug_task(issue, bug):
    ui_task = bug.addTask(target=ui_project)
    watch = bug.addWatch(
        bug_tracker=ui_project.bug_tracker, remote_bug=issue.number
    )
    ui_task.bug_watch = watch
    ui_task.lp_save()


print("Getting ui bugs")
count = 0
for bug in generate_open_bugs():
    username = bug.owner_link.replace("https://api.launchpad.net/1.0/~", "")
    issue_body = f"Bug originally filed by {username} at {bug.web_link}\n\n{bug.description}"
    issue = github_repo.create_issue(bug.title, issue_body)
    create_bug_task(issue, bug)
    count += 1
print(f"Issues created: {count}")
