import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    useIonViewDidEnter,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonInput,
    IonItemGroup,
    IonItemDivider,
    IonIcon,
    IonAlert,
    IonLoading
  } from '@ionic/react';
  import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { remove, add, trash } from 'ionicons/icons';

  interface UpdateContactPageProps extends RouteComponentProps<{
    id: string;
  }> {}
  
  const UpdateContact: React.FC<UpdateContactPageProps> = ({match, history}) => {

    const [showLoading, setShowLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneAddress, setPhoneAddress] = useState([""])
    const [emailAddress, setEmailAddress] = useState([""])


    useIonViewDidEnter(() => {
        setShowLoading(true);
        fetch(`${process.env.REACT_APP_SERVER_URL}/contact/view/${match.params.id}`)
        .then(resp => resp.json())
        .then(datas => {
            setShowLoading(false);
            let contact = datas.data
            setFirstName(contact.first_name)
            setLastName(contact.last_name)
            setPhoneAddress(contact.phone_address)
            setEmailAddress(contact.email_address)
        })
        .catch(err => {
            console.log(err);
            setShowLoading(false);
            history.goBack();
        });
    });

    const onAlertDismiss = () => {
        setShowAlert(false)
        history.replace(`/view/${match.params.id}`)
      
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

    const onContactDelete = () => {
      setShowLoading(true)
      fetch(`${process.env.REACT_APP_SERVER_URL}/contact/delete/${match.params.id}`)
      .then(resp => resp.json())
      .then(datas => {
        setShowLoading(false)
        history.goBack()
      })
      .catch(err => {
        console.log(err);
      });
    }

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setShowLoading(true)
      const url = (`${process.env.REACT_APP_SERVER_URL}/contact/update`)
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contact_id: match.params.id,
            first_name: firstName,
            last_name: lastName,
            phone_numbers: phoneAddress,
            emails: emailAddress
        })
      })
      .then(resp => resp.json())
      .then(datas => {
        setShowLoading(false)
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

            <IonTitle>Edit Contact</IonTitle>
            
            <IonButtons slot="end">
              <IonButton onClick={(e) => setShowDeleteAlert(true)}><IonIcon slot="icon-only" icon={trash} color="danger" /></IonButton>
            </IonButtons>
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
              <IonButton expand="full" type="submit" className="ion-no-margin">Update Contact</IonButton>
            </div>
          </form>
        </IonContent>
        <IonAlert isOpen={showAlert}
          onDidDismiss={onAlertDismiss}
          header={'Operation Status'}
          message={alertMessage}
          buttons={['OK']}
        />
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={'Confirm!'}
          message={'Are you sure?'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: blah => {
                setShowDeleteAlert(false);
              }
            },
            {
              text: 'Delete',
              handler: () => {
                onContactDelete();
              }
            }
          ]}
        />
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={'Loading...'}
        />
      </IonPage>
    );
  };
  export default UpdateContact;