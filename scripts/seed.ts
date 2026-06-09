const {PrismaClient} = require('@prisma/client')

const database = new PrismaClient()

async function main () {
    try {
       const options = await database.category.createMany({
        data: [
            {name: "Development"},
            {name: "Graphic Design"},
            {name: "Motion Graphics"},
            {name: "3D Animation"},
            {name:  "Fitness"},
            {name: "Nutrition"},
            {name: "History"},
            {name: "Science"},
            {name: "Technology"},
            {name: "Music"},
            {name: "Government"},
            {name: "Economics"},
            {name: "Photography"}
        ]
       })
       console.log("Success!! - Categories added to db")
    } catch (error) {
        console.log("Error in seeding data " + `${error}`)
    } finally {
        await database.$disconnect()
    }
}

main()