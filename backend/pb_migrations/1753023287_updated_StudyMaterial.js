/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2665446744")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number2625406741",
    "max": null,
    "min": null,
    "name": "doneAmount",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2665446744")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number2625406741",
    "max": null,
    "min": null,
    "name": "doneAmount",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
