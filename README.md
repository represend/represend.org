## Instructions

* `yarn dev`

The build will be on [http://localhost:3000](http://localhost:3000)
    
## Custom Letters
See [the letter readme](data/README.md) for instructions on how to create and generate letters. If you do make changes, make sure to run:
* `yarn gen`

Note: Prod deployment will automatically generate these json files, but you won't see them on your local unless you run this.
## Prodcution

To run in production mode, run the two commands in order:

* `yarn build`
* `yarn start`