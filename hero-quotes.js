// Rotating hero quotes every 5 minutes

(function(){
  const quotes = [
    { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
    { text: "Justice delayed is justice denied.", author: "William E. Gladstone" },
    { text: "The law is reason free from passion.", author: "Aristotle" },
    { text: "Equal justice under law is not just a caption on the Supreme Court building, it is perhaps one of the most inspiring ideals of our society.", author: "Lewis F. Powell Jr." },
    { text: "Justice cannot be for one side alone, but must be for both.", author: "Eleanor Roosevelt" },
    { text: "Peace and justice are two sides of the same coin.", author: "Dwight D. Eisenhower" },
    { text: "Justice is the constant and perpetual will to allot every man his due.", author: "Justinian I" },
    { text: "The arc of the moral universe is long, but it bends toward justice.", author: "Martin Luther King Jr." },
    { text: "Justice is truth in action.", author: "Benjamin Disraeli" },
    { text: "Justice is the first virtue of social institutions.", author: "John Rawls" },
    { text: "If you want peace, work for justice.", author: "Pope Paul VI" },
    { text: "Justice is conscience, not a personal conscience but the conscience of the whole of humanity.", author: "Aleksandr Solzhenitsyn" },
    { text: "Justice is the sum of all moral duty.", author: "William Godwin" },
    { text: "Justice is the end of government. It is the end of civil society.", author: "James Madison" },
    { text: "Justice is the means by which established injustices are sanctioned.", author: "Anatole France" }
  ];
  function setQuote(){
    var idx = Math.floor(Math.random()*quotes.length);
    var q = quotes[idx];
    var el = document.querySelector('.hero-quote');
    if(el){
      el.innerHTML = `“${q.text}”<br><span>- ${q.author}</span>`;
    }
  }
  setQuote();
})();
