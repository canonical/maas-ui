#!/usr/bin/python3

from launchpadlib.launchpad import Launchpad
from github import Github


class GithubApi:
    def __init__(self):
        self.repo_name = None
        self.g = None

    def set_env(self, token, repo_name):
        self.set_token(token)
        self.set_repository(repo_name)

    def set_token(self, token):
        self.g = Github(token)

    def set_repository(self, repo_name):
        self.repo_name = repo_name

    def create_issue(self, title, body):
        repo = self.g.get_repo(self.repo_name)
        issue = repo.create_issue(title=title, body=body)

        return issue

    def get_repo_id(self):
        repo = self.g.get_repo(self.repo_name)
        self.repo_id = repo.id
        return repo.id


github_token = os.getenv("GITHUB_TOKEN")
github_repo = "canonical-web-and-design/maas-ui"
github_session = GithubApi()
github_session.set_env(github_token, github_repo)

# The repository to add this issue to
status = ["New"]
launchpad = Launchpad.login_with("Canonical web team stats", "production")
project = launchpad.projects["maas"]
ui_project = launchpad.projects["maas-ui"]


def generate_open_bugs():
    for task in project.searchTasks(status=status, tags=["ui"]):
        has_ui_task = any(t.target == ui_project for t in task.related_tasks)
        if not has_ui_task:
            yield task.bug


def create_bug_task(gh_repo, issue, bug):
    # Create bug_task for bug, linked to gh_repo/issue.number
    ui_task = bug.addTask(target=ui_project)
    watch = bug.addWatch(
        bug_tracker=ui_project.bug_tracker, remote_bug=issue.number
    )
    ui_task.bug_watch = watch
    ui_task.lp_save()


def get_username(owner_link):
    # Get the username and return the display name
    return owner_link.replace("https://api.launchpad.net/1.0/~", "")


print("Getting ui bugs")
count = 0
for bug in generate_open_bugs():
    issue_body = f"Bug originally filed by {get_username(bug.owner_link)} at {bug.web_link}\n\n{bug.description}"
    issue = github_session.create_issue(bug.title, issue_body)
    create_bug_task(github_repo, issue, bug)
    print(issue_body)
    count += 1
    break
print(f"Issues created: {count}")
