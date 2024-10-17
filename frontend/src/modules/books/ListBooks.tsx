import { useEffect, useState } from "react";
import { BooksService } from "../../services/BookService";
import AddBook from "./AddBooks";
import UpdateBook from "./UpdateBook";
import Cookies from "universal-cookie";

interface ListBook {
  id: number;
  title: string;
  author: string;
  description: string;
}

const ListBooks = () => {
  const [books, setBooks] = useState<ListBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editBookId, setEditBookId] = useState<number | null>(null);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await BooksService.getBooks();
    if (response.statusCode === 200) {
      setBooks(response.data);
      setError(null);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  const handleBookAdded = () => {
    fetchBooks();
  };

  const handleBookUpdated = () => {
    fetchBooks();
  };

  const handleDelete = async (id: number) => {
    const response = await BooksService.deleteBook(id);
    if (response.statusCode === 200) {
      fetchBooks();
    } else {
      alert(`Error deleting book: ${response.message}`);
    }
  };

  const handleEdit = (id: number) => {
    setEditBookId(id);
    setIsUpdateModalOpen(true);
  };

  const totalPages = Math.ceil(books.length / itemsPerPage);

  const currentBooks = books.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove("token");
    window.location.href = "/login";
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <button
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded-md"
        onClick={() => handleLogout()}
      >
        Log Out
      </button>
      <h2 className="text-3xl font-bold mb-6">List of Books</h2>

      <button
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md"
        onClick={() => setIsModalOpen(true)}
      >
        Add New Book
      </button>

      {loading ? (
        <div className="text-center">Loading books...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2">Title</th>
                <th className="py-2 px-4 border-b-2">Author</th>
                <th className="py-2 px-4 border-b-2">Description</th>
                <th className="py-2 px-4 border-b-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book: ListBook) => (
                <tr key={book.id}>
                  <td className="py-2 px-4 border-b">{book.title}</td>
                  <td className="py-2 px-4 border-b">{book.author}</td>
                  <td className="py-2 px-4 border-b">{book.description}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                      onClick={() => handleEdit(book.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between items-center">
            <button
              className={`px-4 py-2 bg-gray-300 rounded ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              className={`px-4 py-2 bg-gray-300 rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      <AddBook
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookAdded={handleBookAdded}
      />

      <UpdateBook
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        bookId={editBookId}
        onBookUpdated={handleBookUpdated}
      />
    </div>
  );
};

export default ListBooks;
