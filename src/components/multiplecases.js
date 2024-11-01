import React, { useState } from 'react';

export default function MultiCaseUpload() {
    const [cases, setCases] = useState([{ selector_phone: '', name: '', description: '', files: [] }]);
    const [authToken, setAuthToken] = useState(''); // State to hold the authentication token

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const newCases = [...cases];
        newCases[index][name] = value;
        setCases(newCases);
    };

    const handleFileChange = (index, e) => {
        const newCases = [...cases];
        newCases[index].files = Array.from(e.target.files);
        setCases(newCases);
    };

    const addFileInput = (index) => {
        const newCases = [...cases];
        newCases[index].files.push(null); // Add a placeholder for the new file input
        setCases(newCases);
    };

    const addCase = () => {
        setCases([...cases, { selector_phone: '', name: '', description: '', files: [] }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSubmit = {
            cases: cases.map(caseItem => ({
                selector_phone: caseItem.selector_phone,
                name: caseItem.name,
                description: caseItem.description,
                files: caseItem.files.map(file => file.name) // Store file names (or paths if you manage them)
            }))
        };

        // Create FormData to handle file uploads
        const formData = new FormData();
        cases.forEach((caseItem) => {
            // Append case data as JSON
            formData.append('cases', JSON.stringify({
                selector_phone: caseItem.selector_phone,
                name: caseItem.name,
                description: caseItem.description,
                files: caseItem.files // Append actual file objects
            }));
        });

        // Submit dataToSubmit to the backend with the auth token
        await fetch('http://127.0.0.1:8000/api/cases/upload_cdr_multiple/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${authToken}`, // Include the authentication token
            },
            body: formData, // Send FormData
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Multi-Case Upload</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Authentication Token</label>
                    <input
                        type="text"
                        value={authToken}
                        onChange={(e) => setAuthToken(e.target.value)}
                        className="w-full border rounded px-3 py-2 mb-3"
                    />
                </div>
                {cases.map((caseItem, index) => (
                    <div key={index} className="mb-4 border rounded-lg p-3 bg-gray-50">
                        <button
                            type="button"
                            className="w-full text-left flex justify-between items-center"
                            onClick={() => {
                                const newCases = cases.map((item, i) => (i === index ? { ...item, open: !item.open } : item));
                                setCases(newCases);
                            }}
                        >
                            <span className="font-semibold text-gray-700">Case {index + 1}</span>
                            <span className="text-gray-500">{caseItem.open ? '▲' : '▼'}</span>
                        </button>
                        {caseItem.open && (
                            <div className="mt-3">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Selector Phone</label>
                                <input
                                    type="text"
                                    name="selector_phone"
                                    value={caseItem.selector_phone}
                                    onChange={(e) => handleInputChange(index, e)}
                                    className="w-full border rounded px-3 py-2 mb-3"
                                />

                                <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={caseItem.name}
                                    onChange={(e) => handleInputChange(index, e)}
                                    className="w-full border rounded px-3 py-2 mb-3"
                                />

                                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={caseItem.description}
                                    onChange={(e) => handleInputChange(index, e)}
                                    className="w-full border rounded px-3 py-2 mb-3"
                                />

                                <label className="block mb-2 text-sm font-medium text-gray-700">Upload Files</label>
                                {caseItem.files.map((file, fileIndex) => (
                                    <div key={fileIndex} className="flex items-center mb-2">
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                const newCases = [...cases];
                                                newCases[index].files[fileIndex] = e.target.files[0]; // Store selected file
                                                setCases(newCases);
                                            }}
                                            className="w-full border rounded px-3 py-2 mb-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newCases = [...cases];
                                                newCases[index].files.splice(fileIndex, 1); // Remove file input
                                                setCases(newCases);
                                            }}
                                            className="ml-2 bg-red-500 text-white px-2 rounded"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addFileInput(index)}
                                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                >
                                    Add Another File
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addCase}
                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                    Add Another Case
                </button>
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
