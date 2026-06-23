// Qadam shared style tokens — every component pulls from here so the brand
// stays consistent. Colors map to the palette defined in tailwind.config.js.
const styles = {
  custom_container: "w-11/12 hidden sm:block",
  heading:
    "text-[27px] text-center md:text-start font-[600] font-display text-espresso pb-[20px]",
  section: "w-11/12 mx-auto",
  productTitle: "text-[25px] font-[600] font-display text-espresso",
  productDiscountPrice: "font-mono font-semibold text-[18px] text-espresso",
  price: "font-mono font-[500] text-[16px] text-clay pl-3 mt-[-4px] line-through",
  shop_name: "pt-3 text-[15px] font-[500] text-marigold-dark pb-3",
  active_indicator: "absolute bottom-[-27%] left-0 h-[3px] w-full bg-marigold",
  button:
    "w-[150px] bg-espresso hover:bg-coffee transition-colors h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer",
  cart_button:
    "px-[20px] h-[38px] rounded-[20px] bg-espresso hover:bg-coffee transition-colors flex items-center justify-center cursor-pointer",
  cart_button_text: "text-[#fff] text-[16px] font-[600]",
  input:
    "w-full border border-sand bg-white focus:border-marigold p-2 rounded-[6px] transition-colors",
  activeStatus:
    "w-[10px] h-[10px] rounded-full absolute top-0 right-1 bg-[#40d132]",
  noramlFlex: "flex items-center",
};

export default styles;
