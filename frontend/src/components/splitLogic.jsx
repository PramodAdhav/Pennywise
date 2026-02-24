export function calculateSplit(members, dishes) {
  const totals = Array(members.length).fill(0); 

  for (let dish of dishes) {
    if (dish.sharedBy.length === 0) {
      throw new Error(`"${dish.name}" has no selected members.`);
    }

    const priceInPaise = Math.round(dish.price * 100);
    const shareInPaise = Math.floor(
      priceInPaise / dish.sharedBy.length
    );

    dish.sharedBy.forEach(index => {
      totals[index] += shareInPaise;
    });

    const remainder =
      priceInPaise - shareInPaise * dish.sharedBy.length;

    for (let i = 0; i < remainder; i++) {
      totals[dish.sharedBy[i]] += 1;
    }
  }

  return totals.map(amount => amount / 100);
}
