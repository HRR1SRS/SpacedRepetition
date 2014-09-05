# HR SRS

HR SRS is a study aid that leverages the principles of [Spaced Repetition](http://en.wikipedia.org/wiki/Spaced_repetition). You can find a deployed version [here](http://hr-srs.meteor.com/).

## Team

  - __Development Team Members__: [Mike Axtman](https://github.com/mdaxtman), [Chris Bradley](https://github.com/chrbradley), [Chibueze Ikedi](https://github.com/icukaegbu), [Robin Kim](https://github.com/therobinkim)

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

* /client: holds the client-side files
* /client/template: holds the client-side templates
* /server: holds server-side files


## Requirements

- Node 0.10.x
- Meteor 0.9.x


## Development

### Installing Dependencies

From within the root directory:

* `meteor add accounts-passwords`
* `meteor add mizzao:bootstrap-3` OR `meteor add ian:bootstrap-3`
* `meteor add ian:accounts-ui-bootstrap-3` (see usage instructions at http://atmospherejs.com/ian/accounts-ui-bootstrap-3)

Major Changes Made (5/9/14)
-- Refactored the addCard to call cardItem template
-- Added Notifications (meteor add gfk:notifications)
------ Refactored cardItem to display Notifications on success/failure of save
-- Refactored Router links to only display when user is logged in
-- Refactored cardList display in dashboard to show questions but not answers
-- Refactored Review Cards UI and functionality


### Roadmap

View the project roadmap [here](https://waffle.io/HRR1SRS/SpacedRepetition)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
