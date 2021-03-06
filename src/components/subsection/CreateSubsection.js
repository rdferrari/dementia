import React, { useState } from "react";
import { Auth, API, graphqlOperation, Storage } from "aws-amplify";
import { createSubsection } from "../../graphql/mutations";
import { useInput } from "../auth/useInput";

const MediaType = ({
  mediaType,
  type,
  uploading,
  handleUploadFile,
  createSubsectionMedia,
  setShowForm,
  urlKey
}) => {
  return (
    mediaType === type && (
      <div className="upload-btn-wrapper">
        {!urlKey ? (
          <div>
            <input type="file" onChange={handleUploadFile} className="myfile" />
            {uploading === false ? (
              <img className="btn" src="/images/UploadBt.svg" />
            ) : (
              <img className="btn" src="/images/Uploading.svg" />
            )}
          </div>
        ) : (
          <button
            className="primary-button button-transparent-light"
            onClick={createSubsectionMedia}
          >
            Confirm add content
          </button>
        )}

        <div className="section-button-flex">
          <button
            className="primary-button button-transparent-light"
            onClick={() => setShowForm(false)}
          >
            Close form
          </button>
        </div>
      </div>
    )
  );
};

function CreateSubsection({ sectionId, subsections }) {
  const { value: title, bind: bindTitle, reset: resetTitle } = useInput(null);
  const { value: text, bind: bindText, reset: resetText } = useInput(null);
  const [urlKey, setUrlKey] = useState(null);
  const [urlPath, setUrlPath] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async evt => {
    evt.preventDefault();

    const input = {
      sectionId,
      type: mediaType,
      title,
      text,
      urlKey,
      urlPath,
      order: subsections.length,
      ownerUsername: Auth.user.username,
      createdAt: Date.now()
    };

    const result = await API.graphql(
      graphqlOperation(createSubsection, {
        input
      })
    );
    console.info(`Created section: id ${result.data.createSubsection.id}`);

    resetText();
    resetTitle();
    setUrlKey(null);
    setUrlPath(null);
    setMediaType(null);
    setShowForm(false);
  };

  const createSubsectionMedia = async urlKey => {
    const input = {
      sectionId,
      type: mediaType,
      urlKey,
      urlPath,
      text: null,
      title: null,
      order: subsections.length,
      ownerUsername: Auth.user.username,
      createdAt: Date.now()
    };

    const result = await API.graphql(
      graphqlOperation(createSubsection, {
        input
      })
    );
    console.info(`Created section: id ${result.data.createSubsection.id}`);
    resetText();
    setUrlKey(null);
    setUrlPath(null);
    setMediaType(null);
    setShowForm(false);
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
    });
  };

  const handleTypeForm = type => {
    setMediaType(type);
    setShowForm(true);
  };

  return (
    <div className="section-sub-create">
      <div className="section-detail-text-container">
        <h2 className="section-sub-create-title">Create Subsection</h2>

        {showForm === false ? (
          <div className="section-sub-type-container">
            <img
              className="section-sub-create-icon"
              onClick={() => handleTypeForm("TEXT")}
              src="/images/subText.svg"
            />
            <img
              className="section-sub-create-icon"
              onClick={() => handleTypeForm("IMAGE")}
              src="/images/subImage.svg"
            />
            <img
              className="section-sub-create-icon"
              onClick={() => handleTypeForm("IMAGE_360")}
              src="/images/subImage360.svg"
            />
            <img
              className="section-sub-create-icon"
              onClick={() => handleTypeForm("VIDEO")}
              src="/images/subVideo.svg"
            />
            <img
              className="section-sub-create-icon"
              onClick={() => handleTypeForm("VIDEO_360")}
              src="/images/subVideo360.svg"
            />
          </div>
        ) : (
          <div>
            <MediaType
              mediaType={mediaType}
              type="IMAGE"
              setUploading={setUploading}
              handleUploadFile={handleUploadFile}
              uploading={uploading}
              setShowForm={setShowForm}
              createSubsectionMedia={() => createSubsectionMedia(urlKey)}
              urlKey={urlKey}
              setUrlPath={setUrlPath}
            />
            <MediaType
              mediaType={mediaType}
              type="VIDEO"
              setUploading={setUploading}
              handleUploadFile={handleUploadFile}
              uploading={uploading}
              setShowForm={setShowForm}
              createSubsectionMedia={() => createSubsectionMedia(urlKey)}
              urlKey={urlKey}
              setUrlPath={setUrlPath}
            />
            <MediaType
              mediaType={mediaType}
              type="IMAGE_360"
              setUploading={setUploading}
              handleUploadFile={handleUploadFile}
              uploading={uploading}
              setShowForm={setShowForm}
              createSubsectionMedia={() => createSubsectionMedia(urlKey)}
              urlKey={urlKey}
              setUrlPath={setUrlPath}
            />
            <MediaType
              mediaType={mediaType}
              type="VIDEO_360"
              setUploading={setUploading}
              handleUploadFile={handleUploadFile}
              uploading={uploading}
              setShowForm={setShowForm}
              createSubsectionMedia={() => createSubsectionMedia(urlKey)}
              urlKey={urlKey}
              setUrlPath={setUrlPath}
            />

            <form onSubmit={handleSubmit}>
              {mediaType === "TEXT" && (
                <div>
                  <input
                    placeholder="Subsection title"
                    className="input-light"
                    type="text"
                    {...bindTitle}
                  />
                  <textarea
                    rows="6"
                    cols="60"
                    placeholder="Subsection text"
                    className="input-light"
                    type="text"
                    {...bindText}
                  />
                  <div className="section-button-flex">
                    <input
                      className="primary-button button-light"
                      type="submit"
                      value="Add new subsection"
                    />
                    <button
                      className="primary-button button-transparent-light"
                      onClick={() => setShowForm(false)}
                    >
                      Close form
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateSubsection;
