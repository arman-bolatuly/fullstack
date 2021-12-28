const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//create user
router.post("/user", async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
  } catch (error) {
    next(error);
  }
});

// find user by id shows here
router.get("/user/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      //include: {
        //coal: true,
      //},
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// delete user by id
// router.delete("/user/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const deletedUser = await prisma.user.delete({
//       where: {
//         id: Number(id),
//       },
//     });
//     res.json(deletedUser);
//   } catch (error) {
//     next(error);
//   }
// });

// update user here
// this code did not work
// router.patch("/user/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const user = await prisma.user.update({
//       where: {
//         id: Number(id),
//       },
//     });
//     res.json(user);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
