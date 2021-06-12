const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (course) {
  //clonedItems
  const items = [...this.cart.items];
  const idx = items.findIndex((c) => {
    return c.courseId.toString() === course._id.toString();
  });
  if (idx >= 0) {
    //в корзині є такий курс і ми збільшуємо кількість
    items[idx].count = items[idx].count + 1;
  } else {
    //в корзині ще немає такого  курса
    items.push({
      courseId: course._id,
      count: 1,
    });
  }

  // const newCart = { items: clonedItems };
  // this.cart = newCart;
  this.cart = { items };
  return this.save();
};

module.exports = model("User", userSchema);
