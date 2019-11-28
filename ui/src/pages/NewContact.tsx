import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonInput,
    IonButton,
    IonIcon,
    IonItemGroup,
    IonItemDivider,
    IonAlert,
    IonLoading
  } from '@ionic/react';
  import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { add, remove } from 'ionicons/icons';

  
  const NewItem: React.FC<RouteComponentProps> = (props) => {
    const [showLoading, setShowLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [createID, setCreateID] = useState(0)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneAddress, setPhoneAddress] = useState([""])
    const [emailAddress, setEmailAddress] = useState([""])

    const onAlertDismiss = () => {
      setShowAlert(false)
      if (createID) {
        props.history.replace(`/view/${createID}`)
      }
      
    }

    const onPhoneAddressChange = (val:string, i:number) => {
      if (val.length > 0) {
        setPhoneAddress(phoneAddress.map((value, index) => {
          if (index === i) {
            return val
          } else {
            return value
          }
        }))
      }
    }

    const onEmailAddressChange = (val:string, i:number) => {
      if (val.length > 0) {
        setEmailAddress(emailAddress.map((value, index) => {
          if (index === i) {
            return val
          } else {
            return value
          }
        }))
      }
    }

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setShowLoading(true)
      const url = (`${process.env.REACT_APP_SERVER_URL}/contact/add`)
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_numbers: phoneAddress,
          emails: emailAddress
        })
      })
      .then(resp => resp.json())
      .then(datas => {
        setShowLoading(false)
        if (datas.code === "00") {
          setCreateID(datas.meta.contact_id)
        }
        setAlertMessage(datas.message)
        setShowAlert(true)
      })
      .catch(err => {
        console.log(err);
      });
    }


    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>New Contact</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <form onSubmit={onFormSubmit}>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
              <IonItem>
                <IonLabel position="stacked">First Name <IonText color="danger">*</IonText></IonLabel>
                <IonInput required autocomplete="off" type="text" value={firstName} onIonChange={(e) => setFirstName(e.detail.value || "")}></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Last Name <IonText color="danger">*</IonText></IonLabel>
                <IonInput required type="text" autocomplete="off" value={lastName} onIonChange={(e) => setLastName(e.detail.value || "")}></IonInput>
              </IonItem>

              <IonItemGroup>
                <IonItemDivider>
                  <IonLabel>
                    Mobile <IonText color="danger">*</IonText>
                  </IonLabel>
                </IonItemDivider>

                {phoneAddress.map((phone, index) => (
                <IonItem key={`phone${index}`}>
                  <IonButton className="ion-no-padding" slot="start" size="small" color="danger" shape="round" 
                  onClick={(e) => {setPhoneAddress(phoneAddress.filter((el, i) => (i !== index)))}}>
                    <IonIcon slot="icon-only" icon={remove} color="light" />
                  </IonButton>
                  <IonInput required type="text" inputmode="text" autocomplete="off" value={phone} onIonChange={(e) => onPhoneAddressChange(e.detail.value || "", index)}></IonInput>
                </IonItem>
                ))}
                <IonButton fill="clear" size="small" color="dark" onClick={(e) => setPhoneAddress([...phoneAddress, ""])}> <IonIcon slot="icon-only" color="success" icon={add} /> Add Phone</IonButton>
              </IonItemGroup>

              <IonItemGroup>
                <IonItemDivider>
                  <IonLabel>
                    Email Address
                  </IonLabel>
                </IonItemDivider>


                {emailAddress.map((email, index) => (
                  <IonItem key={`email${index}`}>
                    <IonButton className="ion-no-padding" slot="start" size="small" color="danger" shape="round" 
                    onClick={(e) => {setEmailAddress(emailAddress.filter((el, i) => (i !== index)))}}>
                      <IonIcon slot="icon-only" icon={remove} color="light" />
                    </IonButton>
                    <IonInput type="email" inputmode="email" autocomplete="off" value={email} onIonChange={(e) => onEmailAddressChange(e.detail.value || "", index)}></IonInput>
                  </IonItem>
                ))}
                <IonButton fill="clear" size="small" color="dark" onClick={(e) => setEmailAddress([...emailAddress, ""])}> <IonIcon slot="icon-only" color="success" icon={add} /> Add Email Address</IonButton>
              </IonItemGroup>

            </IonList>

            <div className="ion-padding">
              <IonButton expand="full" type="submit" className="ion-no-margin">Create Contact</IonButton>
            </div>
          </form>
        </IonContent>
        <IonAlert isOpen={showAlert}
          onDidDismiss={onAlertDismiss}
          header={'Operation Status'}
          message={alertMessage}
          buttons={['OK']}
        />
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={'Loading...'}
        />
      </IonPage>
    );
  };
  export default NewItem;