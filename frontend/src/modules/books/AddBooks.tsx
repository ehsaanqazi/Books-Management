import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BooksService } from "../../services/BookService";

interface AddBookProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: () => void;
}

const AddBook = ({ isOpen, onClose, onBookAdded }: AddBookProps) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validationSchema = Yup.object({
    title: Yup.string()
      .max(50, "Title must be 50 characters or less")
      .required("Title is required"),
    author: Yup.string()
      .max(50, "Author must be 50 characters or less")
      .required("Author is required"),
    description: Yup.string()
      .max(200, "Description must be 200 characters or less")
      .required("Description is required"),
  });

  const handleSubmit = async (values: {
    title: string;
    author: string;
    description: string;
  }) => {
    setLoading(true);
    const response = await BooksService.addBook(values);
    setLoading(false);

    if (response.statusCode === 201) {
      setSuccessMessage("Book added successfully!");
      onBookAdded();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Book</h2>

        {successMessage ? (
          <div>
            <div className="mb-4 text-center text-white bg-green-500 py-2 px-4 rounded">
              {successMessage}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={() => setSuccessMessage(null)} // Reset form to add another book
              >
                Add Another
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{ title: "", author: "", description: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <Field
                    type="text"
                    name="title"
                    className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Author
                  </label>
                  <Field
                    type="text"
                    name="author"
                    className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm"
                  />
                  <ErrorMessage
                    name="author"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-300 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    disabled={isSubmitting || loading}
                  >
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    ) : (
                      "Add Book"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default AddBook;
