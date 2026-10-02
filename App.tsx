import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

type IconName = "search" | "bag" | "arrow" | "heart" | "close" | "book" | "truck" | "leaf" | "chevron" | "minus" | "plus"
function Icon({
  name,
  size = 20,
  ...props
}: {
  name: IconName
  size?: number
  className?: string
}) {
  const paths: Record<IconName, ReactNode> = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    bag: (
      <>
        <path d="M5 7h14l1 14H4L5 7Z" />
        <path d="M8 8V6a4 4 0 0 1 8 0v2" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    book: (
      <>
        <path d="M12 5v15M3 4c3-1 6-1 9 1 3-2 6-2 9-1v15c-3-1-6-1-9 1-3-2-6-2-9-1V4Z" />
      </>
    ),
    truck: (
      <>
        <path d="M2 5h13v12H2V5Zm13 5h4l3 4v3h-7" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 3C8 2 2 9 6 16s16 3 14-13Z" />
        <path d="M4 21 15 10" />
      </>
    ),
    chevron: <path d="m8 10 4 4 4-4" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M5 12h14M12 5v14" />,
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}

type Book = {
  id: number
  title: string
  author: string
  genre: string
  price: number
  isbn: string
  rating: string
  badge?: string
  color: string
  description: string
}
const books: Book[] = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    price: 16.99,
    isbn: "9780525559474",
    rating: "4.8",
    badge: "BESTSELLER",
    color: "#172e53",
    description:
      "Between life and death there is a library, and within that library, the shelves go on forever. A beautiful story about the choices that make a life well lived.",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-development",
    price: 21.99,
    isbn: "9780735211292",
    rating: "4.9",
    badge: "READER FAVORITE",
    color: "#e9e4d9",
    description:
      "Tiny changes, remarkable results. Discover a practical framework for building good habits, breaking bad ones, and getting a little better every day.",
  },
  {
    id: 3,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Business",
    price: 18.99,
    isbn: "9780857197689",
    rating: "4.7",
    color: "#e4e7dc",
    description:
      "Timeless lessons on wealth, greed, and happiness. Nineteen short stories explore the strange ways people think about money.",
  },
  {
    id: 4,
    title: "Before the Coffee Gets Cold",
    author: "Toshikazu Kawaguchi",
    genre: "Fiction",
    price: 14.99,
    isbn: "9781335430991",
    rating: "4.6",
    color: "#a5c8d8",
    description:
      "In a small Tokyo café, a cup of coffee offers the chance to travel back in time. Four visitors discover what they would change, and what matters most.",
  },
  {
    id: 5,
    title: "The Creative Act",
    author: "Rick Rubin",
    genre: "Art & creativity",
    price: 24.99,
    isbn: "9780593652886",
    rating: "4.8",
    badge: "OUR PICK",
    color: "#e7dfd0",
    description:
      "A way of being. A generous and inspiring exploration of creativity, from noticing the world around us to finding our own authentic voice.",
  },
  {
    id: 6,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Mystery & thriller",
    price: 15.99,
    isbn: "9781250301697",
    rating: "4.7",
    color: "#dcd5c7",
    description:
      "A famous painter stops speaking after a shocking act of violence. One psychotherapist becomes determined to uncover her story in this gripping psychological thriller.",
  },
]
const categories = [
  "All books",
  "Fiction",
  "Non-fiction",
  "Self-development",
  "Business",
  "Mystery & thriller",
  "Art & creativity",
]
const cover = (book: Book) =>
  `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
const money = (value: number) => `$${value.toFixed(2)}`
function loadStored<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [category, setCategory] = useState("All books")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("popular")
  const [view, setView] = useState("all")
  const [saved, setSaved] = useState<number[]>(() =>
    loadStored("chapter-saved", []),
  )
  const [cart, setCart] = useState<Record<number, number>>(() =>
    loadStored("chapter-cart", {}),
  )
  const [cartOpen, setCartOpen] = useState(false)
  const [selected, setSelected] = useState<Book | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [toast, setToast] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const subtotal = books.reduce(
    (sum, book) => sum + book.price * (cart[book.id] || 0),
    0,
  )
  const modalOpen = cartOpen || !!selected || aboutOpen
  useEffect(() => {
    localStorage.setItem("chapter-cart", JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem("chapter-saved", JSON.stringify(saved))
  }, [saved])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(""), 3000)
    return () => clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    if (modalOpen) {
      dialogRef.current?.showModal()
      document.body.style.overflow = "hidden"
    } else {
      dialogRef.current?.close()
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [modalOpen])
  function closeModal() {
    setCartOpen(false)
    setSelected(null)
    setAboutOpen(false)
  }
  function addToCart(book: Book) {
    setCart((previous) => ({
      ...previous,
      [book.id]: (previous[book.id] || 0) + 1,
    }))
    setToast(`${book.title} added to your bag`)
  }
  function updateQuantity(id: number, delta: number) {
    setCart((previous) => {
      const next = { ...previous, [id]: (previous[id] || 0) + delta }
      if (next[id] <= 0) delete next[id]
      return next
    })
  }
  function browse(nextView = "all") {
    setView(nextView)
    setCategory("All books")
    setQuery("")
    document.getElementById("books")?.scrollIntoView({ behavior: "smooth" })
  }
  const filtered = books
    .filter((book) => {
      const categoryMatch =
        category === "All books" ||
        book.genre === category ||
        (category === "Non-fiction" &&
          ["Self-development", "Business", "Art & creativity"].includes(
            book.genre,
          ))
      return (
        categoryMatch &&
        `${book.title} ${book.author}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (view !== "saved" || saved.includes(book.id)) &&
        (view !== "bestsellers" || !!book.badge) &&
        (view !== "new" || book.id >= 4)
      )
    })
    .sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : sort === "title"
            ? a.title.localeCompare(b.title)
            : a.id - b.id,
    )

  return (
    <>
      <div className="announcement">
        A little escape, delivered. Free shipping on orders $35+{" "}
        <span>
          Discover your next great read <Icon name="arrow" size={13} />
        </span>
      </div>
      <header className="header page-width">
        <a href="#" className="brand" aria-label="Chapter and Co home">
          <span className="brand-mark">
            <Icon name="book" size={27} />
          </span>
          <span>
            chapter<span className="brand-amp"> & </span>co
            <span className="brand-dot">.</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={view === "all" ? "nav-link active" : "nav-link"}
            onClick={() => browse()}
          >
            Shop books
          </button>
          <button
            className={view === "bestsellers" ? "nav-link active" : "nav-link"}
            onClick={() => browse("bestsellers")}
          >
            Bestsellers
          </button>
          <button
            className={view === "new" ? "nav-link active" : "nav-link"}
            onClick={() => browse("new")}
          >
            New arrivals
          </button>
          <button className="nav-link" onClick={() => setAboutOpen(true)}>
            Our story
          </button>
        </nav>
        <div className="header-actions">
          <button
            aria-label="View saved books"
            className={`icon-button ${view === "saved" ? "is-saved" : ""}`}
            onClick={() => browse("saved")}
          >
            <Icon name="heart" />
          </button>
          <button
            className="cart-button"
            onClick={() => setCartOpen(true)}
            aria-label={`Shopping bag, ${count} books`}
          >
            <Icon name="bag" />
            <span>Bag</span>
            <span className="cart-count">{count}</span>
          </button>
        </div>
      </header>
      <main>
        <section className="hero page-width">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="little-line" /> FOR THE LOVE OF A GOOD BOOK
            </div>
            <h1>
              Your next chapter
              <br />
              starts <em>here.</em>
            </h1>
            <p>
              Stories that stay with you. Ideas that move you.
              <br className="desktop-break" /> Find your next great read,
              thoughtfully curated.
            </p>
            <button className="button primary" onClick={() => browse()}>
              Explore the collection <Icon name="arrow" size={18} />
            </button>
            <div className="reader-proof">
              <div className="reader-avatars">
                <img src="https://i.pravatar.cc/80?img=47" alt="" />
                <img src="https://i.pravatar.cc/80?img=12" alt="" />
                <img src="https://i.pravatar.cc/80?img=44" alt="" />
                <span>2k+</span>
              </div>
              <div>
                <span className="stars">★★★★★</span>
                <span className="proof-caption">
                  A happy place for book lovers
                </span>
              </div>
            </div>
          </div>
          <div className="hero-art">
            <img
              className="library-photo"
              src="https://images.unsplash.com/photo-1722977735215-d28f2ac6efba?auto=format&fit=crop&w=1100&q=85"
              alt="Shelves of well-loved books in a cozy library"
            />
            <div className="hero-shade" />
            <div className="hero-arch" />
            <div className="hero-books">
              <img
                className="hero-book book-left"
                src={cover(books[1])}
                alt="Atomic Habits by James Clear"
              />
              <img
                className="hero-book book-right"
                src={cover(books[4])}
                alt="The Creative Act by Rick Rubin"
              />
              <img
                className="hero-book book-center"
                src={cover(books[0])}
                alt="The Midnight Library by Matt Haig"
              />
            </div>
            <div className="curated-stamp">
              <Icon name="book" size={24} />
              <span>
                GOOD BOOKS.
                <br />
                GREAT COMPANY.
              </span>
              <span className="stamp-spark">✦</span>
            </div>
            <div className="hero-note">
              <span /> Handpicked stories. Endless possibilities.
            </div>
          </div>
        </section>
        <section className="benefits page-width" aria-label="Our promises">
          <div>
            <Icon name="truck" size={22} />
            <span>Free shipping over $35</span>
          </div>
          <span className="benefit-divider" />
          <div>
            <Icon name="book" size={21} />
            <span>Thoughtfully curated reads</span>
          </div>
          <span className="benefit-divider" />
          <div>
            <Icon name="leaf" size={21} />
            <span>A little kinder to the planet</span>
          </div>
        </section>
        <section className="collection page-width" id="books">
          <div className="collection-heading">
            <div>
              <div className="eyebrow">YOUR BOOKSHELF, REIMAGINED</div>
              <h2>
                {view === "saved"
                  ? "Your saved stories"
                  : view === "new"
                    ? "Fresh off the shelf"
                    : view === "bestsellers"
                      ? "Everyone’s talking about"
                      : "Find your next favorite"}
              </h2>
            </div>
            <label className="search-field">
              <Icon name="search" size={19} />
              <input
                aria-label="Search books or authors"
                placeholder="Search books, authors..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery("")}>
                  <Icon name="close" size={16} />
                </button>
              )}
            </label>
          </div>
          <div className="collection-controls">
            <div className="categories" aria-label="Book categories">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`category ${category === item ? "selected" : ""}`}
                  aria-pressed={category === item}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="sort-control">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="popular">Most popular</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="title">Title: A–Z</option>
              </select>
              <Icon name="chevron" size={15} />
            </div>
          </div>
          <div className="results-summary">
            <span>
              {view === "all" && category === "All books" && !query
                ? "A few of our most-loved reads"
                : `${filtered.length} ${
                    filtered.length === 1 ? "book" : "books"
                  } to discover`}
            </span>
            <span>{filtered.length} books</span>
          </div>
          <div className="book-grid">
            {filtered.map((book) => (
              <article className="book-card" key={book.id}>
                <div
                  className="book-image-area"
                  style={{ "--cover-color": book.color } as React.CSSProperties}
                >
                  {book.badge && (
                    <span
                      className={`book-badge ${
                        book.badge === "OUR PICK" ? "our-pick" : ""
                      }`}
                    >
                      {book.badge}
                    </span>
                  )}
                  <button
                    className={`save-button ${
                      saved.includes(book.id) ? "is-saved" : ""
                    }`}
                    aria-label={`${
                      saved.includes(book.id) ? "Unsave" : "Save"
                    } ${book.title}`}
                    aria-pressed={saved.includes(book.id)}
                    onClick={() =>
                      setSaved((previous) =>
                        previous.includes(book.id)
                          ? previous.filter((id) => id !== book.id)
                          : [...previous, book.id],
                      )
                    }
                  >
                    <Icon name="heart" size={17} />
                  </button>
                  <button
                    className="book-cover-button"
                    onClick={() => setSelected(book)}
                    aria-label={`View ${book.title}`}
                  >
                    <img
                      src={cover(book)}
                      alt={`${book.title} book cover`}
                      loading="lazy"
                    />
                  </button>
                </div>
                <div className="book-info">
                  <span className="book-genre">{book.genre}</span>
                  <button
                    className="book-title"
                    onClick={() => setSelected(book)}
                  >
                    {book.title}
                  </button>
                  <p className="book-author">{book.author}</p>
                  <div className="book-rating">
                    <span>★</span> {book.rating}{" "}
                    <span className="rating-caption">reader rating</span>
                  </div>
                  <div className="book-bottom">
                    <span className="book-price">{money(book.price)}</span>
                    <button
                      className="add-button"
                      aria-label={`Add ${book.title} to bag`}
                      onClick={() => addToCart(book)}
                    >
                      <Icon name="plus" size={15} /> Add to bag
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state">
              <Icon name="book" size={36} />
              <h3>
                {view === "saved"
                  ? "Make a little reading wishlist"
                  : "No books on this shelf just yet"}
              </h3>
              <p>
                {view === "saved"
                  ? "Tap the heart on a book to save it here."
                  : "Try another category, title, or author."}
              </p>
              <button className="button primary" onClick={() => browse()}>
                Browse all books <Icon name="arrow" size={18} />
              </button>
            </div>
          )}
          <div className="collection-footer">
            <span>There’s a story for every kind of reader.</span>
            <button
              onClick={() => {
                browse()
                setToast("You’re viewing our complete curated collection.")
              }}
            >
              Browse all books <Icon name="arrow" size={17} />
            </button>
          </div>
        </section>
        <section className="newsletter page-width">
          <div className="newsletter-icon">
            <Icon name="book" size={35} />
          </div>
          <div className="newsletter-copy">
            <div className="eyebrow">A LITTLE SOMETHING FOR YOUR INBOX</div>
            <h2>Good reads. Good company.</h2>
            <p>
              Reading inspiration, new arrivals, and little bookish joys. No
              plot spoilers.
            </p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              setSubscribed(true)
            }}
            className="newsletter-form"
          >
            {subscribed ? (
              <div className="subscribe-success" role="status">
                Thanks for your interest! Newsletter signup is coming soon.
              </div>
            ) : (
              <>
                <div className="email-control">
                  <input
                    required
                    type="email"
                    aria-label="Your email address"
                    placeholder="Your email address"
                  />
                  <button className="button primary" type="submit">
                    Count me in <Icon name="arrow" size={17} />
                  </button>
                </div>
                <span>
                  Preview only. Your email is not stored and no emails will be
                  sent.
                </span>
              </>
            )}
          </form>
        </section>
      </main>
      <footer className="footer page-width">
        <a href="#" className="brand">
          <Icon name="book" size={22} />
          <span>chapter & co.</span>
        </a>
        <span>A good book is just the beginning.</span>
        <span>© {new Date().getFullYear()} Chapter & Co.</span>
      </footer>
      {toast && (
        <div className="toast" role="status">
          <Icon name="book" size={19} />
          {toast}
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
      <dialog
        ref={dialogRef}
        aria-label={
          cartOpen ? "Your book bag" : selected ? selected.title : "Our story"
        }
        className={`modal ${cartOpen ? "cart-modal" : ""}`}
        onCancel={closeModal}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeModal()
        }}
      >
        <div className="modal-content">
          <button
            className="modal-close icon-button"
            aria-label="Close dialog"
            onClick={closeModal}
          >
            <Icon name="close" />
          </button>
          {cartOpen && (
            <>
              <div className="eyebrow">A NEW CHAPTER AWAITS</div>
              <h2>
                Your book bag <span>({count})</span>
              </h2>
              {count ? (
                <>
                  <p className="shipping-note">
                    {subtotal >= 35
                      ? "Your order qualifies for free shipping."
                      : `You’re ${money(35 - subtotal)} away from free shipping.`}
                  </p>
                  <div className="cart-items">
                    {books
                      .filter((book) => cart[book.id])
                      .map((book) => (
                        <div className="cart-item" key={book.id}>
                          <img src={cover(book)} alt={book.title} />
                          <div className="cart-item-info">
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <div className="quantity">
                              <button
                                onClick={() => updateQuantity(book.id, -1)}
                                aria-label={`Remove one ${book.title}`}
                              >
                                <Icon name="minus" size={14} />
                              </button>
                              <span>{cart[book.id]}</span>
                              <button
                                onClick={() => updateQuantity(book.id, 1)}
                                aria-label={`Add one ${book.title}`}
                              >
                                <Icon name="plus" size={14} />
                              </button>
                            </div>
                          </div>
                          <strong>{money(book.price * cart[book.id])}</strong>
                        </div>
                      ))}
                  </div>
                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <strong>{money(subtotal)}</strong>
                  </div>
                  <p className="checkout-note">
                    This is a storefront preview. Checkout and payment will be
                    available once the Java backend is connected.
                  </p>
                  <button
                    className="button primary full-width"
                    onClick={closeModal}
                  >
                    Keep exploring <Icon name="arrow" size={18} />
                  </button>
                </>
              ) : (
                <div className="empty-state">
                  <Icon name="bag" size={40} />
                  <h3>A story is waiting for you</h3>
                  <p>Your bag is empty. Let’s find your next great read.</p>
                  <button
                    className="button primary"
                    onClick={() => {
                      closeModal()
                      browse()
                    }}
                  >
                    Explore books <Icon name="arrow" size={18} />
                  </button>
                </div>
              )}
            </>
          )}
          {selected && (
            <div className="book-detail">
              <div className="detail-cover">
                <img src={cover(selected)} alt={selected.title} />
              </div>
              <div>
                <div className="eyebrow">{selected.genre}</div>
                <h2>{selected.title}</h2>
                <p className="detail-author">by {selected.author}</p>
                <div className="book-rating">
                  <span>★</span> {selected.rating} reader rating
                </div>
                <p className="detail-description">{selected.description}</p>
                <span className="detail-format">Paperback · English</span>
                <div className="detail-price">{money(selected.price)}</div>
                <button
                  className="button primary"
                  onClick={() => addToCart(selected)}
                >
                  Add to bag <Icon name="bag" size={18} />
                </button>
              </div>
            </div>
          )}
          {aboutOpen && (
            <div className="about-content">
              <Icon name="book" size={36} />
              <div className="eyebrow">HELLO, FELLOW BOOK LOVER</div>
              <h2>
                A good book is just
                <br />
                the beginning.
              </h2>
              <p>
                Chapter & Co. is a little corner of the internet for big ideas,
                unexpected adventures, and stories that stay with you.
              </p>
              <p>
                We believe finding your next book should feel like a
                conversation with a well-read friend. Our small, thoughtfully
                curated collection brings together reader favorites and new
                discoveries, one chapter at a time.
              </p>
              <button
                className="button primary"
                onClick={() => {
                  closeModal()
                  browse()
                }}
              >
                Find your next chapter <Icon name="arrow" size={18} />
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  )
}
