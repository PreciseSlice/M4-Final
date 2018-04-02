
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('items')
    .del()
      .then( () => {
        return Promise.all([
          knex('items')
            .insert(
              {
                name: 'first item',
                packed: false
              },
              'id'
            )
            .insert(
              {
                name: 'second item',
                packed: false
              },
              'id'
            )
        ])
    })
  .catch(error => console.log(`Error seeding data: ${error}`))
}
