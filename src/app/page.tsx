import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <div className="quote-type-selection">
        <h1>Insurance Quote System</h1>
        <p>Select the type of quote you would like to request:</p>
        
        <div>
          <Link href="/home-quote/step/1" className="quote-type-button">
            Home Insurance Quote
          </Link>
          
          <Link href="/auto-quote/step/1" className="quote-type-button">
            Auto Insurance Quote
          </Link>
        </div>
      </div>
    </div>
  );
}