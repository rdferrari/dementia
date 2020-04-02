import React, { useState } from "react";
import { Auth, API, graphqlOperation, Storage } from "aws-amplify";
import { S3Image } from "aws-amplify-react";
import { createSection } from "../../graphql/mutations";
import { useInput } from "../auth/useInput";

function CreateSection({ sections }) {
  const { value: title, bind: bindTitle, reset: resetTitle } = useInput(null);
  const { value: intro, bind: bindIntro, reset: resetIntro } = useInput(null);
  const { value: body, bind: bindBody, reset: resetBody } = useInput(null);
  const [urlKey, setUrlKey] = useState(null);
  const [urlPath, setUrlPath] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async evt => {
    evt.preventDefault();

    const input = {
      title,
      intro,
      body,
      urlKey,
      urlPath,
      order: sections.length,
      ownerUsername: Auth.user.username,
      createdAt: Date.now()
    };

    const result = await API.graphql(
      graphqlOperation(createSection, {
        input
      })
    );
    console.info(`Created section: id ${result.data.createSection.id}`);

    resetTitle();
    resetIntro();
    resetBody();
    setUrlKey(null);
    setUrlPath(null);
  };

  const handleUploadFile = async event => {
    event.preventDefault();
    const file = event.target.files[0];

    const randomExtension = Math.floor(Math.random() * 90000) + 10000;

    const name = randomExtension + file.name;

    setUploading(true);

    Storage.put(name, file).then(() => {
      setUrlKey(name);
      setUploading(false);
      Storage.get(name)
        .then(result => setUrlPath(result))
        .catch(err => console.log(err));
    });
  };

  const handleDeleteImage = async imageUrl => {
    Storage.remove(imageUrl).then(() => {
      setUrlKey(null);
    });
  };

  if (showForm === false) {
    return (
      <div className="section-create-container-detail">
        <button
          className="add-section-button button-dark"
          onClick={() => setShowForm(true)}
        >
          Add new section
        </button>
      </div>
    );
  } else {
    return (
      <div className="section-create-container-detail">
        {urlKey ? (
          <div>
            <S3Image className="section-card-image" imgKey={urlKey} />
            <button
              className="primary-button button-transparent"
              onClick={() => handleDeleteImage(urlKey)}
            >
              Delete image
            </button>
          </div>
        ) : (
          <div className="upload-btn-wrapper">
            <input type="file" onChange={handleUploadFile} className="myfile" />
            {uploading === false ? (
              <img className="btn" src="/images/UploadBt.svg" />
            ) : (
              <img className="btn" src="/images/Uploading.svg" />
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            <input
              placeholder="Section title"
              className="input-light"
              type="text"
              {...bindTitle}
            />
          </label>
          <label>
            <textarea
              rows="6"
              cols="60"
              placeholder="Section introduction"
              className="input-light"
              type="text"
              {...bindIntro}
            />
          </label>
          <label>
            <textarea
              rows="6"
              cols="60"
              placeholder="Section body text"
              className="input-light"
              type="text"
              {...bindBody}
            />
          </label>
          <div className="section-button-flex">
            <input
              className="primary-button button-dark"
              type="submit"
              value="Add new section"
            />
            <button
              className="primary-button button-transparent"
              onClick={() => setShowForm(false)}
            >
              Close form
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateSection;
