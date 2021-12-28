const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// coals shows here
router.post("/coal", async (req, res, next) => {
  try {
    const { ostatokPG, prihod, rashod, ostatok, name, mestorozhdenie } =
      req.body;
    console.log(req.body);
    const coal = await prisma.coal.create({
      data: {
        mestorojdenie: mestorozhdenie,
        name_of_coal: name,
        ospp: ostatokPG,
        prihod: prihod,
        rashod: rashod,
        ostatok: ostatok,
      },
    });
    res.json(req.query);
  } catch (error) {
    next(error);
  }
});

//find all
router.get("/feed", async (req, res, next) => {
  try {
    //const { authorId } = req.params;
    const coal = await prisma.coal.findMany({
      where: { published: true },
      include: { author: true },
    });
    res.json(coal);
  } catch (error) {
    next(error);
  }
});

// // find coals by id shows here
// router.get("/coal/:authorId", async (req, res, next) => {
//   try {
//     //const { authorId } = req.params;
//     const coal = await prisma.coal.findMany({
//       where: { published: true, authorId: 2 },
//       include: { author: true },
//     });
//     res.json(coal);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/coal/:authorId", async (req, res, next) => {
//   try {
//     //const { authorId } = req.params;
//     const coal = await prisma.coal.findMany({
//       where: { published: true, authorId: 3 },
//       include: { author: true },
//     });
//     res.json(coal);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/coal/:authorId", async (req, res, next) => {
//   try {
//     //const { authorId } = req.params;
//     const coal = await prisma.coal.findMany({
//       where: { published: true, authorId: 4 },
//       include: { author: true },
//     });
//     res.json(coal);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/coal/:authorId", async (req, res, next) => {
  try {
    const { authorId } = req.params;
    const coal = await prisma.coal.findMany({
      where: { authorId: Number(authorId)},
      include: { author: true },
    });
    res.json(coal);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
